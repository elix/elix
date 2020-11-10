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
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        selectedItemFlags: null,
        selectedItems: null,
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      if (changed.selectedItemFlags && state.items && state.selectedItemFlags) {
        const { items, selectedItemFlags } = state;

        // If new selectedItemFlags array size doesn't match that of items array,
        // create a new selectedItemFlags array that matches size.
        if (selectedItemFlags.length !== items.length) {
          const newSelectedFlags =
            selectedItemFlags.length > items.length
              ? // Trim to fit
                selectedItemFlags.slice(0, items.length)
              : // Stretch to fit
                [
                  ...selectedItemFlags,
                  ...Array(items.length - selectedItemFlags.length).fill(false),
                ];
          Object.assign(effects, {
            selectedItemFlags: newSelectedFlags,
          });
        } else {
          // Size of selectedItemFlags matches items array. Reflect the new
          // selection in selectedItems.
          const selectedItems = items.filter(
            (item, index) => selectedItemFlags[index]
          );
          Object.assign(effects, { selectedItems });
        }
      } else if (changed.items && state.items) {
        // If items change but selectedItemFlags doesn't, try to (re)initialize
        // selectedItemFlags using the latest set of selectedItems.
        const { items, selectedItems } = state;
        const selectedItemFlags = selectedItemsToFlags(items, selectedItems);
        Object.assign(effects, { selectedItemFlags });
      }

      return effects;
    }

    /**
     * Toggle the element of the `selectedItemFlags` array with the given index.
     *
     * If the `toggle` parameter is omitted, the indicated flag is flipped. If a
     * boolean value is supplied for `toggle`, the flag is set to that value.
     *
     * @protected
     * @param {number} index - the index into the `selectedItemFlags` array
     * @param {boolean} [toggle] - if supplied, the value to set the flag to
     */
    [toggleSelectedFlag](index, toggle) {
      if (super[toggleSelectedFlag]) {
        super[toggleSelectedFlag](index, toggle);
      }

      // Create a new copy of selectedItemFlags
      const newSelectedFlags = [...this[state].selectedItemFlags];

      // Apply the toggle. If undefined, flip the current value.
      newSelectedFlags[index] =
        toggle !== undefined ? toggle : !newSelectedFlags[index];

      this[setState]({
        selectedItemFlags: newSelectedFlags,
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
