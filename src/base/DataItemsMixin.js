import { createElement } from "../../src/core/template.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, renderDataToElement, stateEffects } from "./internal.js";

/**
 * Converts an array of data entries into an array of items to render
 *
 * @module DataItemsMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DataItemsMixin(Base) {
  return class DataItems extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState], {
        data: null,
        itemPartType: "div",
        items: null,
      });
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // If data dimension changes, recreate items.
      if (changed.data || changed.itemPartType) {
        const { data, itemPartType } = state;
        const dataLength = data ? data.length : 0;
        const itemsLength = state.items ? state.items.length : 0;
        if (dataLength !== itemsLength || changed.itemPartType) {
          // TODO: Reuse existing items array if present, just invoke
          // `renderDataToElement` to update data.
          const items =
            data == null
              ? null
              : data.map((entry) => {
                  const item = createElement(itemPartType);
                  this[renderDataToElement](entry, item);
                  return item;
                });
          Object.assign(effects, { items });
        }
      }

      return effects;
    }

    /**
     * Render the data to the given element.
     *
     * The default implementation of this sets the element's `textContent`
     * to the `toString` value of the `data`. Override this method to
     * render the data in a custom way.
     *
     * @param {any} data
     * @param {Element} element
     */
    [renderDataToElement](data, element) {
      element.textContent = data.toString();
    }
  };
}
