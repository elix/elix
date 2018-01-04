import { merge } from './updates.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
import symbols from './symbols.js';


const Base =
  ContentItemsMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )));


/**
 * Shows exactly one child element at a time. This can be useful, for example,
 * if a given UI element has multiple modes that present substantially different
 * elements.
 *
 * This component doesn't provide any UI for changing which mode is shown. A
 * common pattern in which buttons select the mode are tabs, a pattern
 * implemented by the [Tabs](Tabs) component.
 *
 * @inherits ElementBase
 * @mixes ContentItemsMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 */
class Modes extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const display = !calcs.selected ?
      'none' :
      base.style && base.style.display;
    return merge(base, {
      style: {
        display
      }
    });
  }

  get [symbols.template]() {
    return `<slot></slot>`;
  }

  get updates() {
    const base = super.updates || {};
    return merge(base, {
      style: {
        'display': this.state.original.style.display || 'inline-block',
        'position': 'relative'
      }
    });
  }

}


customElements.define('elix-modes', Modes);
export default Modes;
