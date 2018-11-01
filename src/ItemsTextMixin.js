import * as symbols from './symbols.js';


/**
 * Manages this.state.texts from this.state.items.
 *
 * @module ItemsTextMixin
 */
export default function ItemsTextMixin(Base) {

  // The class prototype added by the mixin.
  class ItemsText extends Base {

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        itemsForTexts: null,
        texts: null
      });
    }

    // Default implementation returns an item's `alt` attribute or its
    // `textContent`, in that order.
    [symbols.getItemText](item) {
      return item.getAttribute('alt') || item.textContent;
    }

    refineState(state) {
      let result = super.refineState ? super.refineState(state) : true;
      const items = state.items || null;
      const itemsChanged = items !== state.itemsForTexts;
      if (itemsChanged) {
        const texts = Array.prototype.map.call(items, item =>
          this[symbols.getItemText](item));
        Object.freeze(texts);
        Object.assign(state, {
          texts,
          itemsForTexts: items
        });
        result = false;
      }
      return result;
    }
  }

  return ItemsText;
}
