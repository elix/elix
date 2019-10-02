import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Exposes the text content of a list's items as an array of strings.
 *
 * @module ItemsTextMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ItemsTextMixin(Base) {
  // The class prototype added by the mixin.
  class ItemsText extends Base {
    get [internal.defaultState]() {
      const state = Object.assign(super[internal.defaultState], {
        texts: null
      });

      // Regenerate texts when items change.
      state.onChange('items', state => {
        const { items } = state;
        const texts = getTextsFromItems(items, this[internal.getItemText]);
        if (texts) {
          Object.freeze(texts);
          return { texts };
        }
        return null;
      });

      return state;
    }

    /**
     * Extract the text from the given item.
     *
     * The default implementation returns an item's `alt` attribute or its
     * `textContent`, in that order.
     *
     * @param {ListItemElement} item
     * @returns {string}
     */
    [internal.getItemText](item) {
      return getItemText(item);
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
export function getItemText(item) {
  return item.getAttribute('alt') || item.textContent || '';
}

/**
 * Extract the text from the given items.
 *
 * @private
 * @param {ListItemElement[]} items
 */
export function getTextsFromItems(items, getText = getItemText) {
  return items ? Array.from(items, item => getText(item)) : null;
}
