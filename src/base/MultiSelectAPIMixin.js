import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  raiseChangeEvents,
  rendered,
  setState,
  state,
  toggleSelectedFlag,
} from "./internal.js";
import { selectedItemsToFlags } from "./ItemsMultiSelectMixin.js";

/**
 * Exposes a public API for multiple selection on a list-like element.
 *
 * This mixin expects a component to provide an `items` Array of all elements in
 * the list. This mixin also expects the component to apply
 * [ItemsMultiSelectMixin](ItemsMultiSelectMixin) or otherwise define a compatible
 * `selectedFlags` and `selectedItems` state.
 *
 * Given the above, this mixin exposes a consistent public API for reading and
 * manipulating the current item as a multiple-selection. This includes public members
 * `selectedFlags` and `selectedItems`, selection navigation methods, and a
 * `selected-flags-changed` event.
 *
 * This mixin does not produce any user-visible effects to represent selection;
 * that is up to the component to provide.
 * *
 * @module MultiSelectAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function MultiSelectAPIMixin(Base) {
  // The class prototype added by the mixin.
  class MultiSelectAPI extends Base {
    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // Raise selected-flags-changed event
      if (changed.selectedFlags && this[raiseChangeEvents]) {
        /**
         * Raised when the `selectedFlags` property changes.
         *
         * @event selected-flags-changed
         */
        const event = new CustomEvent("selected-flags-changed", {
          bubbles: true,
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * An array of boolean values indicating which items are selected.
     *
     * @type {boolean[]}
     */
    get selectedFlags() {
      return this[state].selectedFlags;
    }
    set selectedFlags(selectedFlags) {
      this[setState]({ selectedFlags });
    }

    /**
     * An array containing the subset of items which are currently selected.
     *
     * @type {ListItemElement[]}
     */
    get selectedItems() {
      return this[state].selectedItems;
    }
    set selectedItems(selectedItems) {
      const items = this[state].items;
      const selectedFlags = selectedItemsToFlags(items, selectedItems);
      this[setState]({ selectedFlags });
    }

    /**
     * Toggles the indicated value in the `selectedFlags` array.
     *
     * @param {number} index - the position the `selectedFlags` array
     * @param {boolean} [toggle] - if present, the flag will be set to
     * this boolean value; if omitted, the flag will be toggled
     */
    toggleSelectedFlag(index, toggle) {
      this[toggleSelectedFlag](index, toggle);
    }
  }

  return MultiSelectAPI;
}
