import * as props from '../mixins/props.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../mixins/symbols.js';


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
 * @extends ElementBase
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
        'display': this.originalProps.style.display || 'inline-block',
        'position': 'relative'
      }
    });
  }

  itemProps(item, index, original) {
    const base = super.itemProps ? super.itemProps(item, index, original) : {};
    const selected = index === this.state.selectedIndex;
    const display = !selected ?
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
