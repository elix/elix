import * as props from '../utilities/props.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../utilities/symbols.js';


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
 * @mixes ContentItemsMixin
 * @mixes SlotContentMixin
 * @mixes SingleSelectionMixin
 */
class Modes extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  get props() {
    const base = super.props || {};
    return props.merge(base, {
      style: {
        'display': this.state.original.style.display || 'inline-block',
        'position': 'relative'
      }
    });
  }

  itemProps(item, calcs, original) {
    const base = super.itemProps ? super.itemProps(item, calcs, original) : {};
    const display = !calcs.selected ?
      'none' :
      base.style && base.style.display;
    return props.merge(base, {
      style: {
        display
      }
    });
  }

  get [symbols.template]() {
    return `<slot></slot>`;
  }

}


customElements.define('elix-modes', Modes);
export default Modes;
