import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, setState, state, stateEffects } from "./internal.js";

/**
 * Adds mutiple-selection semantics to a list-like element.
 *
 * @module MultiSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function MultiSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class MultiSelection extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectedFlags: null,
        selectedItems: null,
      });
    }

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

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      let updatedSelectedFlags = false;

      // If items change, (re)initialize selectedFlags.
      if (changed.items) {
        const { items, selectedItems } = state;
        const selectedFlags = selectedItemsToFlags(items, selectedItems);
        Object.assign(effects, { selectedFlags });
        updatedSelectedFlags = true;
      }

      // If selectedFlags flags change, update selectedItems.
      if (changed.selectedFlags || updatedSelectedFlags) {
        const { items, selectedFlags } = state;
        const selectedItems = [];
        if (selectedFlags) {
          selectedFlags.forEach((value, index) => {
            if (value) {
              selectedItems.push(items[index]);
            }
          });
        }
        Object.assign(effects, { selectedItems });
      }

      return effects;
    }
  }

  return MultiSelection;
}

// Given a complete set of items and a subset of selected items, return an array
// of booleans indicating which items are selected.
function selectedItemsToFlags(items, selectedItems) {
  const count = items ? items.length : 0;
  const selectedFlags = Array(count).fill(false);

  // Try to reacquire previously selectedFlags items.
  if (selectedItems && items) {
    selectedItems.forEach((item) => {
      const index = items.indexOf(item);
      if (index >= 0) {
        selectedFlags[index] = true;
      }
    });
  }

  return selectedFlags;
}
