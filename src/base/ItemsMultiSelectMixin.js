import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  setState,
  state,
  stateEffects,
  toggleSelectedFlag,
} from "./internal.js";

/**
 * Tracks multiple selection state for a list-like element.
 *
 * @module ItemsMultiSelectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ItemsMultiSelectMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsMultiSelect extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectedFlags: null,
        selectedItems: null,
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      let updatedSelectedFlags = false;

      // If items change, try to (re)initialize selectedFlags using the latest
      // set of selectedItems.
      if (changed.items) {
        const { items, selectedItems } = state;
        const selectedFlags = selectedItemsToFlags(items, selectedItems);
        Object.assign(effects, { selectedFlags });
        updatedSelectedFlags = true;
      }

      // If selectedFlags flags change (directly, or as a result of the above),
      // update selectedItems.
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

    [toggleSelectedFlag](index, toggle) {
      if (super[toggleSelectedFlag]) {
        super[toggleSelectedFlag](index, toggle);
      }

      // Create a new copy of selectedFlags
      const newSelectedFlags = [...this[state].selectedFlags];

      // Apply the toggle. If undefined, flip the current value.
      newSelectedFlags[index] =
        toggle !== undefined ? toggle : !newSelectedFlags[index];

      this[setState]({
        selectedFlags: newSelectedFlags,
      });
    }
  }

  return ItemsMultiSelect;
}

// Given a complete set of items and a subset of selected items, return an array
// of booleans indicating which items are selected.
export function selectedItemsToFlags(items, selectedItems) {
  const count = items ? items.length : 0;
  const selectedFlags = Array(count).fill(false);

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
