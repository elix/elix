import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, setState, state, stateEffects } from "./internal.js";

/**
 * Exposes a public API for the value of a list-like element.
 *
 * @module SelectedValueAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SelectedValueAPIMixin(Base) {
  // The class prototype added by the mixin.
  class SelectedValueAPI extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        value: "",
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Value tracks the value attribute on the selected item.
      if (changed.items || changed.selectedIndex) {
        const { items, selectedIndex } = state;
        const selectedItem = items ? items[selectedIndex] : null;
        const value = selectedItem ? selectedItem.getAttribute("value") : "";
        Object.assign(effects, { value });
      }

      return effects;
    }

    /**
     * The value attribute of the selected item.
     *
     * Setting this to a string will attempt to select the first list item whose
     * value attribute matches that string. Setting this to a string not
     * matching any value attribute will result in no selection.
     *
     * @type {string}
     */
    get value() {
      return this[state].value;
    }
    set value(value) {
      // Find index of item with desired value.
      const { items } = this[state];
      const selectedIndex = items
        ? indexOfItemWithValue(items, String(value))
        : -1;
      this[setState]({ selectedIndex });
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
