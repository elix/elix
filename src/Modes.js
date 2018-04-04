import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  SingleSelectionMixin(
  SlotItemsMixin(
    ElementBase
  ));


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
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
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
    return `
      <style>
        :host {
          display: inline-flex;
          position: relative;
        }
      </style>
      <slot></slot>
    `;
  }

}


customElements.define('elix-modes', Modes);
export default Modes;
