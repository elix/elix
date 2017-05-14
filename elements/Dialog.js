//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import BackdropWrapper from './BackdropWrapper.js';
import FocusCaptureWrapper from './FocusCaptureWrapper.js';
import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import symbols from '../mixins/symbols.js';


const mixins = [
  AttributeMarshallingMixin,
  DialogModalityMixin,
  KeyboardMixin,
  OpenCloseMixin,
  OverlayMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


class DialogCore extends base {

  // TODO: Make `backdrop` a symbol.
  get backdrop() {
    return this.shadowRoot.querySelector('#backdrop');
  }

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }

    // Set default ARIA role for the dialog.
    if (this.getAttribute('role') == null && this[symbols.defaults].role) {
      this.setAttribute('role', this[symbols.defaults].role);
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.role = 'dialog';
    return defaults;
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        #backdrop {
          background: black;
          opacity: 0.2;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
      </style>
      <slot></slot>
    `;
  }

}


class Dialog extends BackdropWrapper(FocusCaptureWrapper(DialogCore)) {}


customElements.define('elix-dialog', Dialog);
export default Dialog;
