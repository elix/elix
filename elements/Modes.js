import { html } from '../node_modules/lit-html/lit-html.js';
import { mergeDeep } from '../mixins/helpers.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';


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

  itemProps(item, index, original) {
    const base = super.itemProps ? super.itemProps(item, index, original) : {};
    const hidden = original.hidden || index !== this.state.selectedIndex;
    const style = original.style;
    return mergeDeep(base, {
      hidden,
      style
    });
  }

  hostProps() {
    const base = super.hostProps ? super.hostProps() : {};
    const style = {
      'display': 'inline-block',
      'position': 'relative'
    };
    return mergeDeep(base, { style });
  }

  get template() {
    return html`<slot></slot>`;
  }

}


customElements.define('elix-modes', Modes);
export default Modes;
