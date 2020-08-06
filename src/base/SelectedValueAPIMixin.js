import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, rendered, setState, state } from "./internal.js";

/**
 * Exposes a public API for the value of a list-like element.
 *
 * @module SelectedValueAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SelectedValueAPIMixin(Base) {
  // The class prototype added by the mixin.
  class SelectedValueAPI extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState], {
        desiredValue: null,
      });
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      // If we have a desired value to apply and now have items, apply the
      // value.
      const { items, desiredValue } = this[state];
      if ((changed.desiredValue || changed.items) && desiredValue && items) {
        const index = indexOfItemWithValue(items, desiredValue);
        this[setState]({
          selectedIndex: index,
          desiredValue: null,
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
      const { items, selectedIndex } = this[state];
      const selectedItem = items ? items[selectedIndex] : null;
      return selectedItem ? selectedItem.getAttribute("value") : "";
    }
    set value(value) {
      const { items } = this[state];
      if (items === null) {
        // No items yet, save and try again later.
        this[setState]({
          desiredValue: value,
        });
      } else {
        // Select the index of the indicated value, if found.
        const selectedIndex = indexOfItemWithValue(items, value);
        this[setState]({ selectedIndex });
      }
    }
  }

  return SelectedValueAPI;
}

/**
 * @private
 * @param {Element[]} items
 * @param {string} value
 */
function indexOfItemWithValue(items, value) {
  return items.findIndex((item) => item.getAttribute("value") === value);
}
