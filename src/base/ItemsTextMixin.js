import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, getItemText, stateEffects } from "./internal.js";

/**
 * Exposes the text content of a list's items as an array of strings.
 *
 * @module ItemsTextMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ItemsTextMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsText extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        texts: null,
      });
    }

    /**
     * Extract the text from the given item.
     *
     * The default implementation returns an item's `aria-label`, `alt` attribute,
     * or its `textContent`, in that order. You can override this to return the
     * text that should be used.
     *
     * @param {ListItemElement} item
     * @returns {string}
     */
    [getItemText](item) {
      return getDefaultItemText(item);
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Regenerate texts when items change.
      if (changed.items) {
        const { items } = state;
        const texts = getTextsFromItems(items, this[getItemText]);
        if (texts) {
          Object.freeze(texts);
          Object.assign(effects, { texts });
        }
      }

      return effects;
    }
  }

  return ItemsText;
}

/**
 * Extract the text from the given item.
 *
 * @private
 * @param {ListItemElement} item
 */
export function getDefaultItemText(item) {
  return (
    item.getAttribute("aria-label") ||
    item.getAttribute("alt") ||
    item.textContent ||
    ""
  );
}

/**
 * Extract the text from the given items.
 *
 * @private
 * @param {ListItemElement[]} items
 */
export function getTextsFromItems(items, getText = getDefaultItemText) {
  return items ? Array.from(items, (item) => getText(item)) : null;
}
