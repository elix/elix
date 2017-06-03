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


const Base =
  // Relative order of wrapper application matters: first focus capture
  // wrapper, then backdrop wrapper. Remaining mixins can be applied in
  // any order.
  BackdropWrapper(
  FocusCaptureWrapper(

  AttributeMarshallingMixin(
  DialogModalityMixin(
  KeyboardMixin(
  OpenCloseMixin(
  OverlayMixin(
  ShadowReferencesMixin(
  ShadowTemplateMixin(
    HTMLElement
  )))))))));


class Dialog extends Base {

  // TODO: Make `backdrop` a symbol.
  get backdrop() {
    return this.shadowRoot.querySelector('#backdrop');
  }

  [symbols.template](filler) {
    return super[symbols.template](`
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        :host(:not(.visible)) {
          display: none;
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
      ${filler || `<slot></slot>`}
    `);
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
