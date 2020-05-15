import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { rendered, setState, state } from "./internal.js";

/**
 * Defines a component's value as the text content of the selected item.
 *
 * This mixin exists for list-like components that want to provide a more
 * convenient way to get/set the selected item using text. It adds a `value`
 * property that gets the `textContent` of a component's `selectedItem`. The
 * `value` property can also be set to set the selection to the first item in
 * the `items` collection that has the requested `textContent`. If the indicated
 * text is not found in `items`, the selection is cleared.
 *
 * This mixin expects a component to provide an `items` array of all elements in
 * the list. A standard way to do that with is
 * [ContentItemsMixin](ContentItemsMixin). This also expects the definition of a
 * `currentIndex` state, which can be obtained from
 * [ItemsCursorMixin](ItemsCursorMixin).
 *
 * @module SelectedItemTextValueMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SelectedItemTextValueMixin(Base) {
  // The class prototype added by the mixin.
  class SelectedItemTextValue extends Base {
    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // If we have a pending value to apply and now have items, apply the
      // value.
      const { items, pendingValue } = this[state];
      if (pendingValue && items) {
        const index = indexOfItemWithText(items, pendingValue);
        this[setState]({
          currentIndex: index,
          pendingValue: null,
        });
      }
    }

    /**
     * The text content of the selected item.
     *
     * Setting this value to a string will attempt to select the first list item
     * whose text content match that string. Setting this to a string not matching
     * any list item will result in no selection.
     *
     * @type {string}
     */
    get value() {
      return this.selectedItem == null || this.selectedItem.textContent == null
        ? ""
        : this.selectedItem.textContent;
    }
    set value(text) {
      const items = this[state].items;
      if (items === null) {
        // No items yet, save and try again later.
        this[setState]({
          pendingValue: text,
        });
      } else {
        // Select the index of the indicate text, if found.
        const currentIndex = indexOfItemWithText(items, text);
        this[setState]({ currentIndex });
      }
    }
  }

  return SelectedItemTextValue;
}

/**
 * @private
 * @param {Element[]} items
 * @param {string} text
 */
function indexOfItemWithText(items, text) {
  return items.findIndex((item) => item.textContent === text);
}
