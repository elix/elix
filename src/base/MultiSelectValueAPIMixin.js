import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, setState, state, stateEffects } from "./internal.js";

/**
 * Exposes a public API for the value of a multi-select list-like element.
 *
 * @module MultiSelectValueAPIMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function MultiSelectValueAPIMixin(Base) {
  // The class prototype added by the mixin.
  class MultiSelectValueAPI extends Base {
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
      if (changed.selectedItems) {
        const { selectedItems } = state;
        const selectedValues = selectedItems
          ? selectedItems.map((item) => item.getAttribute("value"))
          : [];
        const value = selectedValues.filter((value) => value).join("\n");
        Object.assign(effects, { value });
      }

      return effects;
    }

    /**
     * The return-delimited list of value attributes of the selected itemss.
     *
     * Setting this value to a string will attempt to select the corresponding
     * items. If one of the return-delimited values does not match a value
     * attribute of a list item, it will be ignored.
     *
     * @type {string}
     */
    get value() {
      return this[state].value;
    }
    set value(value) {
      // Find set of items with the desired values.
      const { items } = this[state];
      const values = value.split("\n");
      const selectedItemFlags = items.map((item) =>
        values.includes(item.getAttribute("value"))
      );
      this[setState]({ selectedItemFlags });
    }
  }

  return MultiSelectValueAPI;
}
