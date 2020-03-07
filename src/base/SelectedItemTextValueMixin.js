import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

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
 * This mixin expects a component to provide an `items` array of all elements
 * in the list. A standard way to do that with is
 * [ContentItemsMixin](ContentItemsMixin). This also expects the definition
 * of `selectedIndex` and `selectedItem` properties, which can be obtained
 * from [SingleSelectionMixin](SingleSelectionMixin).
 *
 * @module SelectedItemTextValueMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SelectedItemTextValueMixin(Base) {
  // The class prototype added by the mixin.
  class SelectedItemTextValue extends Base {
    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      const { items, pendingValue } = this[internal.state];
      if (pendingValue && items) {
        const index = indexOfItemWithText(items, pendingValue);
        this[internal.setState]({
          selectedIndex: index,
          pendingValue: null
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
      const items = this[internal.state].items;
      if (items === null) {
        // No items yet, save and try again later.
        this[internal.setState]({
          pendingValue: text
        });
      } else {
        // Select the index of the indicate text, if found.
        const selectedIndex = indexOfItemWithText(items, text);
        this[internal.setState]({ selectedIndex });
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
  return items.findIndex(item => item.textContent === text);
}
