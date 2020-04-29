import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { setState, state, toggleSelectedFlag } from "./internal.js";
import { selectedItemsToFlags } from "./ItemsMultiSelectMixin.js";

/**
 * Defines a public API for multiple selection.
 *
 * @module MultiSelectAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function MultiSelectAPIMixin(Base) {
  // The class prototype added by the mixin.
  class MultiSelectAPI extends Base {
    get selectedFlags() {
      return this[state].selectedFlags;
    }
    set selectedFlags(selectedFlags) {
      this[setState]({ selectedFlags });
    }

    get selectedItems() {
      return this[state].selectedItems;
    }
    set selectedItems(selectedItems) {
      const items = this[state].items;
      const selectedFlags = selectedItemsToFlags(items, selectedItems);
      this[setState]({ selectedFlags });
    }

    toggleSelectedFlag(index, toggle) {
      this[toggleSelectedFlag](index, toggle);
    }
  }

  return MultiSelectAPI;
}
