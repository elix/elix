import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { getDefaultText } from "./content.js";
import {
  defaultState,
  getItemText,
  setState,
  state,
  stateEffects,
} from "./internal.js";

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
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectedText: "",
      });
    }

    /**
     * Extract the text from the given item.
     *
     * The default implementation returns an item's `aria-label`, `alt`
     * attribute, `innerText`, or `textContent`, in that order. You can override
     * this to return the text that should be used.
     *
     * @param {Element} item
     * @returns {string}
     */
    [getItemText](item) {
      return super[getItemText]
        ? super[getItemText](item)
        : getDefaultText(item);
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // selectedText tracks text of selected item
      if (changed.items || changed.selectedIndex) {
        const { items, selectedIndex } = state;
        const selectedItem = items ? items[selectedIndex] : null;
        const selectedText = selectedItem
          ? this[getItemText](selectedItem)
          : "";
        Object.assign(effects, { selectedText });
      }

      return effects;
    }

    /**
     * The text content of the selected item.
     *
     * Setting this value to a string will attempt to select the first list item
     * whose text matches that string. Setting this to a string not matching any
     * list item will result in no selection.
     *
     * @type {string}
     */
    get selectedText() {
      return this[state].selectedText;
    }
    set selectedText(selectedText) {
      // Find index of item with desired text.
      const { items } = this[state];
      const selectedIndex = items
        ? indexOfItemWithText(items, this[getItemText], String(selectedText))
        : -1;
      this[setState]({ selectedIndex });
    }
  }

  return SelectedTextAPI;
}

/**
 * @private
 * @param {Element[]} items
 * @param {string} text
 */
function indexOfItemWithText(items, getText, text) {
  return items.findIndex((item) => getText(item) === text);
}
