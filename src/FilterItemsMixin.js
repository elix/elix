import * as symbols from './symbols.js';


export default function FilterItemsMixin(Base) {
  
  return class FilterItems extends Base {

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

    itemMatchesInState(item, state) {
      const base = super.itemMatchesInState ?
        super.itemMatchesInState(item, state) :
        true;
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
          items: null,  // Indicate that items need to be recalculated.
          filterForItems: state.filter
        });
        result = false;
      }
      return result;
    }

  }
}
