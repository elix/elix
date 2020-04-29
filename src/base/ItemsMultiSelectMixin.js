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

      if (changed.selectedFlags && state.items && state.selectedFlags) {
        const { items, selectedFlags } = state;

        // If new selectedFlags array size doesn't match that of items array,
        // create a new selectedFlags array that matches size.
        if (selectedFlags.length !== items.length) {
          const newSelectedFlags =
            selectedFlags.length > items.length
              ? // Trim to fit
                selectedFlags.slice(0, items.length)
              : // Stretch to fit
                [
                  ...selectedFlags,
                  ...Array(items.length - selectedFlags.length).fill(false),
                ];
          Object.assign(effects, {
            selectedFlags: newSelectedFlags,
          });
        } else {
          // Size of selectedFlags matches items array. Reflect the new
          // selection in selectedItems.
          const selectedItems = items.filter(
            (item, index) => selectedFlags[index]
          );
          Object.assign(effects, { selectedItems });
        }
      } else if (changed.items && state.items) {
        // If items change but selectedFlags doesn't, try to (re)initialize
        // selectedFlags using the latest set of selectedItems.
        const { items, selectedItems } = state;
        const selectedFlags = selectedItemsToFlags(items, selectedItems);
        Object.assign(effects, { selectedFlags });
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
  return items.map((item) =>
    selectedItems ? selectedItems.indexOf(item) >= 0 : false
  );
}
