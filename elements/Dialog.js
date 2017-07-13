import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import BackdropWrapper from './BackdropWrapper.js';
import FocusCaptureWrapper from './FocusCaptureWrapper.js';
import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
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
  ShadowTemplateMixin(
    HTMLElement
  ))))))));


/**
 * This component presents its children as a basic modal dialog which appears on
 * top of the main page content and which the user must interact with before
 * they can return to the page.
 * 
 * Dialog uses `BackdropWrapper` to add a backdrop behind the main overlay
 * content. Both the backdrop and the dialog itself can be styled.
 * 
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes BackdropWrapper
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureWrapper
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes ShadowTemplateMixin
 */
class Dialog extends Base {

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
