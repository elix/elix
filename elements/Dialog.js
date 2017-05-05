import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import DialogWrapper from './DialogWrapper.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import symbols from '../mixins/symbols.js';


const contentTemplateKey = Symbol('contentTemplate');


const mixins = [
  AttributeMarshallingMixin,
  KeyboardMixin,
  OpenCloseMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);

class DialogCore extends base {

  get [contentTemplateKey]() {
    return `<slot></slot>`;
  }

  static get contentTemplateKey() {
    return contentTemplateKey;
  }

  get [symbols.template]() {
    return this[contentTemplateKey];
  }

}


class Dialog extends DialogWrapper(DialogCore) {}


customElements.define('elix-dialog', Dialog);
export default Dialog;
