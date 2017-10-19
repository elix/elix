import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import * as props from '../mixins/props.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../mixins/symbols.js';


const Base = 
  ContentItemsMixin(
  SlotContentMixin(
    ElementBase
  ));


class Spread extends Base {

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    return props.merge(base, {
      style: {
        'display': original.style && original.style.display || 'flex',
        'position': 'relative',
        'width': `${this.items.length * 100}%`
      }
    });
  }

  itemProps(item, index, original) {
    const base = super.itemProps ? super.itemProps(item, index, original) : {};
    return props.merge(base, {
      style: {
        'objectFit': 'contain',
        'width': `${100 / this.items.length}%`
      }
    })
  }

  get [symbols.template]() {
    return `<slot></slot>`;
  }

}


customElements.define('elix-spread', Spread);
export default Spread;
