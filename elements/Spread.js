import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import * as props from '../utilities/props.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../utilities/symbols.js';


const Base = 
  ContentItemsMixin(
  SlotContentMixin(
    ElementBase
  ));


class Spread extends Base {

  get props() {
    return props.merge(super.props, {
      style: {
        'width': `${this.items.length * 100}%`
      }
    });
  }

  itemProps(item, calcs, original) {
    const base = super.itemProps ? super.itemProps(item, calcs, original) : {};
    return props.merge(base, {
      style: {
        'objectFit': 'contain',
        'width': `${100 / this.items.length}%`
      }
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: flex;
          position: relative;
        }
      </style>
      <slot></slot>
    `;
  }

}


customElements.define('elix-spread', Spread);
export default Spread;
