import { stateChanged } from './utilities.js';
import { substantiveElement } from './content.js';
import * as symbols from './symbols.js';
import * as updates from './updates.js';


const previousStateKey = Symbol('previousState');
const originalKey = Symbol('original');


/**
 * Treats an element's content nodes as list items.
 *
 * Items differ from nodes contents in several ways:
 *
 * * They are often referenced via index.
 * * They may have a selection state.
 * * It's common to do work to initialize the appearance or state of a new
 *   item.
 * * Text nodes are filtered out.
 * * Auxiliary invisible child elements are filtered out and not counted as
 *   items. Auxiliary elements include link, script, style, and template
 *   elements. This filtering ensures that those auxiliary elements can be
 *   used in markup inside of a list without being treated as list items.
 *
 * This mixin expects a component to provide a `content` property returning a
 * raw set of elements. You can provide that yourself, or use
 * [SlotContentMixin](SlotContentMixin).
 *
 * The most commonly referenced property defined by this mixin is the `items`
 * property. To avoid having to do work each time that property is requested,
 * this mixin supports an optimized mode. If you invoke the `contentChanged`
 * method when the set of items changes, the mixin concludes that you'll take
 * care of notifying it of future changes, and turns on the optimization. With
 * that on, the mixin saves a reference to the computed set of items, and will
 * return that immediately on subsequent calls to the `items` property. If you
 * use this mixin in conjunction with `SlotContentMixin`, the `contentChanged`
 * method will be invoked for you when the element's children change, turning on
 * the optimization automatically.
 *
 * Most Elix [elements](elements) use `ContentItemsMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module ContentItemsMixin
 */
export default function ContentItemsMixin(Base) {
  return class ContentItems extends Base {

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      const itemsChanged = this.state.items !== previousState.items;
      if (itemsChanged && this[symbols.raiseChangeEvents]) {
        /**
         * Raised when the `items` property changes.
         * 
         * @event SingleSelectionMixin#items-changed
         */
        const event = new CustomEvent('items-changed');
        this.dispatchEvent(event);
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        contentForItems: null,
        items: null
      });
    }

    /**
     * Returns a set of calculations about the given item that can be derived from
     * the component's current state.
     *
     * The goal of the `itemCalcs` step is to ensure that all mixins/classes use
     * a consistent definition for facts about an item that can be derived from
     * component state. By default, `itemCalcs` includes a member `index`
     * containing the index of the indicated item. Other mixins/classes can
     * extend the result of `itemCalcs` to include additional facts.
     *
     * For example, the [SingleSelectionMixin](SingleSelectionMixin) tracks
     * selection at the component level through a state member
     * `state.selectedIndex`. When rendering a specific item, a component
     * generally wants to know, "Is this specific item the one which is
     * selected?". `SingleSelectionMixin` does this with a defintion for
     * `itemCalcs` that looks like this:
     *
     *     itemCalcs(item, index) {
     *       const base = super.itemCalcs ? super.itemCalcs(item, index) : null;
     *       return Object.assign({}, base, {
     *         selected: index === this.selectedIndex
     *       });
     *     }
     *
     * This ensures that any other aspect of the component that wants to inspect
     * the selected state of a given item uses a consistent definition for
     * selection.
     * 
     * @param {Element} item - the item being considered
     * @param {number} index - the item's position in the list
     */
    itemCalcs(item, index) {
      const base = super.itemCalcs ? super.itemCalcs(item, index) : {};
      return Object.assign(
        {},
        base,
        {
          index,
          matches: index >= 0
        }
      );
    }

    [symbols.itemMatchesState](item, state) {
      const base = super[symbols.itemMatchesState] ?
        super[symbols.itemMatchesState](item, state) :
        true;
      return base && substantiveElement(item);
    }

    /**
     * The current set of items drawn from the element's current state.
     * 
     * @returns {Element[]|null} the element's current items
     */
    get items() {
      return this.state ? this.state.items : null;
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

    refineState(state) {
      let result = super.refineState ? super.refineState(state) : true;
      state[previousStateKey] = state[previousStateKey] || {
        content: null
      };
      const changed = stateChanged(state, state[previousStateKey]);
      const content = state.content;
      const needsItems = content && !state.items; // Signal from other mixins
      if (changed.content || needsItems) {
        const items = content ?
          Array.prototype.filter.call(content, item => this[symbols.itemMatchesState](item, state)) :
          null;
        if (items) {
          Object.freeze(items);
        }
        Object.assign(state, {
          items,
          contentForItems: content
        });
        result = false;
      }
      return result;
    }

    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
      if (this.itemUpdates) {
        const content = this.state.content || [];
        const elements = Array.prototype.filter.call(content, node => node instanceof Element);
        let itemCount = 0;
        elements.forEach((item) => {
          if (item[originalKey] === undefined) {
            item[originalKey] = updates.current(item);
          }
          const index = this[symbols.itemMatchesState](item, this.state) ?
            itemCount++ :
            -1;
          const calcs = this.itemCalcs(item, index);
          updates.apply(item, this.itemUpdates(item, calcs, item[originalKey]));
        });
      }
    }

  }
}
