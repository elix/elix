import { merge } from '../utilities/updates.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../utilities/symbols.js';


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
    return merge(super.updates, {
      style: {
        'width': `${this.items.length * 100}%`
      }
    });
  }

}


customElements.define('elix-spread', Spread);
export default Spread;
