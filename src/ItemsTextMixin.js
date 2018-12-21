import * as symbols from './symbols.js';


/**
 * Exposes the text content of a list's items as an array of strings.
 *
 * @module ItemsTextMixin
 */
export default function ItemsTextMixin(Base) {

  // The class prototype added by the mixin.
  class ItemsText extends Base {

    get defaultState() {
      const state = Object.assign(super.defaultState, {
        texts: null
      });

      // Regenerate texts when items change.
      state.onChange('items', state => {
        const { items } = state;
        const texts = getTextsFromItems(items, this[symbols.getItemText]);
        if (texts) {
          Object.freeze(texts);
          return { texts };
        }
        return null;
      });
      
      return state;
    }

    // Default implementation returns an item's `alt` attribute or its
    // `textContent`, in that order.
    [symbols.getItemText](item) {
      return getItemText(item);
    }
  }

  return ItemsText;
}


export function getItemText(item) {
  return item.getAttribute('alt') || item.textContent;
}


export function getTextsFromItems(items, getText = getItemText) {
  return items ?
    Array.from(items, item => getText(item)) :
    null;
}
