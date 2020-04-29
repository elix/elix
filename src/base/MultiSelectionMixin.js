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
        selected: null,
        selectedItems: null,
      });
    }

    get selected() {
      return this[state].selected;
    }
    set selected(selected) {
      this[setState]({ selected });
    }

    get selectedItems() {
      return this[state].selectedItems;
    }
    set selectedItems(selectedItems) {
      const items = this[state].items;
      const selected = itemsToSelected(items, selectedItems);
      this[setState]({ selected });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      let updatedSelected = false;

      // If items change, (re)initialize selected.
      if (changed.items) {
        const { items, selectedItems } = state;
        const selected = itemsToSelected(items, selectedItems);
        Object.assign(effects, { selected });
        updatedSelected = true;
      }

      // If selected flags change, update selectedItems.
      if (changed.selected || updatedSelected) {
        const { items, selected } = state;
        const selectedItems = [];
        if (selected) {
          selected.forEach((value, index) => {
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
function itemsToSelected(items, selectedItems) {
  const count = items ? items.length : 0;
  const selected = Array(count).fill(false);

  // Try to reacquire previously selected items.
  if (selectedItems && items) {
    selectedItems.forEach((item) => {
      const index = items.indexOf(item);
      if (index >= 0) {
        selected[index] = true;
      }
    });
  }

  return selected;
}
