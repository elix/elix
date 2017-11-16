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


/**
 * Spreads its items out evenly, so they take an equivalent fraction of the
 * component's width.
 * 
 * @mixes ContentItemsMixin
 * @mixes SlotContentMixin
 */
class Spread extends Base {

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const width = original.style.width || `${100 / this.items.length}%`;
    return merge(base, {
      style: {
        'objectFit': 'contain',
        width
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
