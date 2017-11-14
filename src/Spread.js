import { merge } from './updates.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import SlotContentMixin from './SlotContentMixin.js';
import symbols from './symbols.js';


const Base = 
  ContentItemsMixin(
  SlotContentMixin(
    ElementBase
  ));


class Spread extends Base {

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    return merge(base, {
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

  get updates() {
    const count = this.items ? this.items.length : 0;
    return merge(super.updates, {
      style: {
        'width': `${count * 100}%`
      }
    });
  }

}


customElements.define('elix-spread', Spread);
export default Spread;
