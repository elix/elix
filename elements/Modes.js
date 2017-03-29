import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin';
import ContentItemsMixin from '../mixins/ContentItemsMixin';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin';
import symbols from '../mixins/symbols';


const mixins = [
  AttributeMarshallingMixin,
  ContentItemsMixin,
  DefaultSlotContentMixin,
  ShadowTemplateMixin,
  SingleSelectionMixin
];

const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


/**
 * Shows exactly one child element at a time. This can be useful, for example,
 * if a given UI element has multiple modes that present substantially different
 * elements.
 *
 * This component doesn't provide any UI for changing which mode is shown.
 *
 * @extends HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ContentItemsMixin
 * @mixes DefaultSlotContentMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 */
class Modes extends base {

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.selectionRequired = true;
    return defaults;
  }

  [symbols.itemAdded](item) {
    if (super[symbols.itemAdded]) { super[symbols.itemAdded](item); }
    // TODO: See node about aria-hidden below.
    // item.setAttribute('aria-hidden', 'false');
  }

  [symbols.itemSelected](item, selected) {
    if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    item.style.display = selected ? '' : 'none';
    // TODO: Should the modes which are not visible be exposed to ARIA?
    // Sometimes this will be desirable, as when an inactive mode should be
    // both physically invisible and invisible to ARIA. In other cases, it
    // might be desirable to let the user navigate the modes with the keyboard,
    // in which case ARIA should be able to see the inactive modes.
    // item.setAttribute('aria-hidden', !selected);
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <slot></slot>
    `;
  }

}


customElements.define('elix-modes', Modes);
export default Modes;
