import * as content from './content.js';
import Symbol from './Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const itemsSymbol = Symbol('items');
const itemInitializedSymbol = Symbol('itemInitialized');


/**
 * Mixin which maps content semantics (nodes) to list item semantics.
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
 * [DefaultSlotContentMixin](DefaultSlotContentMixin).
 *
 * The most commonly referenced property defined by this mixin is the `items`
 * property. To avoid having to do work each time that property is requested,
 * this mixin supports an optimized mode. If you invoke the `contentChanged`
 * method when the set of items changes, the mixin concludes that you'll take
 * care of notifying it of future changes, and turns on the optimization. With
 * that on, the mixin saves a reference to the computed set of items, and will
 * return that immediately on subsequent calls to the `items` property. If you
 * use this mixin in conjunction with `DefaultSlotContentMixin`, the
 * `contentChanged` method will be invoked for you when the element's children
 * change, turning on the optimization automatically.
 *
 * Most Elix [elements](elements) use `ContentItemsMixin`, including
 * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
 *
 * @module ContentItemsMixin
 * @param base {Class} - The base class to extend
 * @returns {Class} The extended class
 */
export default function ContentItemsMixin(base) {

  // The class prototype added by the mixin.
  class ContentItems extends base {

    [symbols.contentChanged]() {
      if (super[symbols.contentChanged]) { super[symbols.contentChanged](); }

      // Since we got the contentChanged call, we'll assume we'll be notified if
      // the set of items changes later. We turn on memoization of the items
      // property by setting our internal property to null (instead of
      // undefined).
      this[itemsSymbol] = null;

      this[symbols.itemsChanged]();
    }

    /**
     * The current set of items in the list. See the top-level documentation for
     * mixin for a description of how items differ from plain content.
     *
     * @type {HTMLElement[]}
     */
    get items() {
      let items;
      if (this[itemsSymbol] == null) {
        items = content.substantiveElements(this[symbols.content]);
        // Note: test for *equality* with null, since we use `undefined` to
        // indicate that we're not yet caching items.
        if (this[itemsSymbol] === null) {
          // Memoize the set of items.
          this[itemsSymbol] = items;
        }
      } else {
        // Return the memoized items.
        items = this[itemsSymbol];
      }
      return items;
    }

    /**
     * This method is invoked when the underlying contents change. It is also
     * invoked on component initialization – since the items have "changed" from
     * being nothing.
     */
    [symbols.itemsChanged]() {
      if (super[symbols.itemsChanged]) { super[symbols.itemsChanged](); }

      // Perform per-item initialization if `itemAdded` is defined.
      if (this[symbols.itemAdded]) {
        Array.prototype.forEach.call(this.items, item => {
          if (!item[itemInitializedSymbol]) {
            this[symbols.itemAdded](item);
            item[itemInitializedSymbol] = true;
          }
        });
      }

      if (this[symbols.raiseChangeEvents]) {
        this.dispatchEvent(new CustomEvent('items-changed'));
      }
    }

    /**
     * Fires when the items in the list change.
     *
     * @memberof ContentItems
     * @event items-changed
     */
  }

  return ContentItems;
}
