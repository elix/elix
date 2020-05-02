import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Exposes a public API for single selection on a list-like element
 *
 * This mixin expects a component to provide an `items` Array of all elements in
 * the list. This mixin also expects the component to apply
 * [ItemsCursorMixin](ItemsCursorMixin) or otherwise define a compatible
 * `currentIndex` state and other state members for navigating the current item.
 *
 * Given the above, this mixin exposes a consistent public API for reading and
 * manipulating the current item as a selection. This includes public members
 * `selectedIndex` and `selectedItem`, selection navigation methods, and a
 * `selected-index-changed` event.
 *
 * This mixin does not produce any user-visible effects to represent selection;
 * that is up to the component to provide.
 *
 * @module SingleSelectAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SingleSelectAPIMixin(Base) {
  // The class prototype added by the mixin.
  class SingleSelectAPI extends Base {
    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      if (changed.currentIndex && this[internal.raiseChangeEvents]) {
        const selectedIndex = this[internal.state].currentIndex;
        /**
         * Raised when the `selectedIndex` property changes.
         *
         * @event selected-index-changed
         */
        const event = new CustomEvent("selected-index-changed", {
          detail: { selectedIndex },
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * The index of the currently-selected item, or -1 if no item is selected.
     *
     * @type {number}
     */
    get selectedIndex() {
      const { items, currentIndex } = this[internal.state];
      return items && items.length > 0 ? currentIndex : -1;
    }
    set selectedIndex(selectedIndex) {
      const parsed = Number(selectedIndex);
      if (!isNaN(parsed)) {
        this[internal.setState]({
          currentIndex: parsed,
        });
      }
    }

    /**
     * The currently-selected item, or null if no item is selected.
     *
     * @type {Element}
     */
    get selectedItem() {
      const { items, currentIndex } = this[internal.state];
      return items && items[currentIndex];
    }
    set selectedItem(selectedItem) {
      const { items } = this[internal.state];
      if (!items) {
        return;
      }
      const index = items.indexOf(selectedItem);
      if (index >= 0) {
        this[internal.setState]({ currentIndex: index });
      }
    }
  }

  return SingleSelectAPI;
}
