import { html } from '../node_modules/lit-html/lit-html.js';
import * as props from '../mixins/props.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AttributeMarshallingMixin(
  ContentItemsMixin(
  DefaultSlotContentMixin(
  LitHtmlShadowMixin(
  ReactiveMixin(
  SingleSelectionMixin(
    HTMLElement
  ))))));

/**
 * Shows exactly one child element at a time. This can be useful, for example,
 * if a given UI element has multiple modes that present substantially different
 * elements.
 *
 * This component doesn't provide any UI for changing which mode is shown. A
 * common pattern in which buttons select the mode are tabs, a pattern
 * implemented by the [Tabs](Tabs) component.
 *
 * @extends HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ContentItemsMixin
 * @mixes DefaultSlotContentMixin
 * @mixes SingleSelectionMixin
 */
class Modes extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    const style = Object.assign(
      {},
      original.style,
      base.style,
      {
        'display': original.style.display || 'inline-block',
        'position': 'relative'
      }
    );
    return props.mergeProps(base, { style });
  }

  itemProps(item, index, original) {
    const base = super.itemProps ? super.itemProps(item, index, original) : {};
    const hidden = original.hidden || index !== this.state.selectedIndex;
    const style = original.style;
    return props.mergeProps(base, {
      hidden,
      style
    });
  }

  get [symbols.template]() {
    return html`<slot></slot>`;
  }

}


customElements.define('elix-modes', Modes);
export default Modes;
