import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, rendered, setState, state } from "./internal.js";

/**
 * Exposes a public API for the selected text of a list-like element.
 *
 * This mixin exists for list-like components that want to provide a more
 * convenient way to get/set the selected item using text. It adds a `selectedText`
 * property that gets the `textContent` of a component's `selectedItem`. The
 * `selectedText` property can also be set to set the selection to the first item in
 * the `items` collection that has the requested `textContent`. If the indicated
 * text is not found in `items`, the selection is cleared.
 *
 * This mixin expects a component to provide an `items` array of all elements in
 * the list. A standard way to do that with is
 * [ContentItemsMixin](ContentItemsMixin). This also expects the definition of a
 * `selectedIndex` state, which can be obtained from
 * [CursorSelectMixin](CursorSelectMixin).
 *
 * @module SelectedTextAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SelectedTextAPIMixin(Base) {
  // The class prototype added by the mixin.
  class SelectedTextAPI extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState], {
        desiredSelectedText: null,
      });
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // If we have desired text to apply and now have items, apply the text.
      const { items, desiredSelectedText } = this[state];
      if (desiredSelectedText && items) {
        const index = indexOfItemWithText(items, desiredSelectedText);
        this[setState]({
          selectedIndex: index,
          desiredSelectedText: null,
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
    get selectedText() {
      const { items, selectedIndex } = this[state];
      const selectedItem = items ? items[selectedIndex] : null;
      return selectedItem == null || selectedItem.textContent == null
        ? ""
        : selectedItem.textContent;
    }
    set selectedText(selectedText) {
      const { items } = this[state];
      if (items === null) {
        // No items yet, save and try again later.
        this[setState]({
          desiredSelectedText: selectedText,
        });
      } else {
        // Select the index of the indicated text, if found.
        const selectedIndex = indexOfItemWithText(items, selectedText);
        this[setState]({ selectedIndex });
      }
    }
  }

  return SelectedTextAPI;
}

/**
 * @private
 * @param {Element[]} items
 * @param {string} text
 */
function indexOfItemWithText(items, text) {
  return items.findIndex((item) => item.textContent === text);
}
