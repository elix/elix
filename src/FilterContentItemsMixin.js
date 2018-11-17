import * as symbols from './symbols.js';


export default function FilterContentItemsMixin(Base) {
  
  return class FilterContentItems extends Base {

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        filter: null,
        filterForItems: null
      });
    }

    get filter() {
      return this.state.filter;
    }
    set filter(filter) {
      // If external code sets the filter, it's impossible for that code to
      // predict the effects on the items and selection, so we'll need to raise
      // change events.
      const saveRaiseChangesEvents = this[symbols.raiseChangeEvents];
      this[symbols.raiseChangeEvents] = true;
      this.setState({ filter });
      this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
    }

    /**
     * Determine what updates should be applied to an item to reflect the current state,
     * using the format defined by the [updates](updates) helpers.
     * 
     * By default, this returns an empty object. You should override this method
     * (or use mixins that override this method) to indicate what updates should
     * be applied to the given item during rendering.
     * 
     * Example: [AriaListMixin](AriaListMixin) uses code similar to the following to
     * have an item's `aria-selected` attribute reflect its selection state:
     * 
     *     itemUpdates(item, calcs, original) {
     *       const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
     *       return merge(base, {
     *         attributes: {
     *           'aria-selected': calcs.selected
     *         },
     *       });
     *     }
     * 
     * This code fragment is intended for use with
     * [SingleSelectionMixin](SingleSelectionMixin), which provides the
     * `calcs.selected` member.
     * 
     * @param {Element} item - the item to be updated
     * @param {object} calcs - per-item calculations derived from element state
     * @param {object} original - the item's original HTML attributes, classes, and style
     * @returns {object} the DOM updates that should be applied to the item
     */
    itemUpdates(item, calcs, original) {
      return super.itemUpdates ?
        super.itemUpdates(item, calcs, original) :
        {};
    }

    itemMatchesInState(item, state) {
      const base = super.itemMatchesInState ? super.itemMatchesInState(item) : true;
      if (!base) {
        return false;
      }
      const text = item.textContent && item.textContent.toLowerCase();
      const filter = state.filter && state.filter.toLowerCase();
      return !filter ?
        true :
        !text ?
          false :
          text.includes(filter);
    }

    refineState(state) {
      let result = super.refineState ? super.refineState(state) : true;
      const filterChanged = state.filter !== state.filterForItems;
      if (filterChanged) {
        Object.assign(state, {
          contentForItems: null,
          filterForItems: state.filter
        });
        result = false;
      }
      return result;
    }

  }
}
