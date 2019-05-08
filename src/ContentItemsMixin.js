import { isSubstantiveElement } from './content.js';
import * as symbols from './symbols.js';


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

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      if (changed.items && this[symbols.raiseChangeEvents]) {
        /**
         * Raised when the `items` property changes.
         * 
         * @event items-changed
         */
        const event = new CustomEvent('items-changed');
        this.dispatchEvent(event);
      }
    }

    get defaultState() {
      const state = Object.assign(super.defaultState, {
        items: null
      });

      // Regenerate items when content changes, or if items has been nullified
      // by another mixin (as a signal that items should be regenerated).
      state.onChange(['content', 'items'], (state, changed) => {
        const content = state.content;
        const needsItems = content && !state.items; // Signal from other mixins
        if (changed.content || needsItems) {
          const items = content ?
            Array.prototype.filter.call(content, item => this[symbols.itemMatchesState](item, state)) :
            null;
          if (items) {
            Object.freeze(items);
          }
          return { items };
        }
        return null;
      });

      return state;
    }

    [symbols.itemMatchesState](item, state) {
      const base = super[symbols.itemMatchesState] ?
        super[symbols.itemMatchesState](item, state) :
        true;
      return base && isSubstantiveElement(item);
    }

    /**
     * The current set of items drawn from the element's current state.
     * 
     * @returns {Element[]|null} the element's current items
     */
    get items() {
      return this.state ? this.state.items : null;
    }

    originalItemAttributes(item) {
      return item[originalKey];
    }

  }
}
