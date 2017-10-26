import * as props from '../mixins/props.js';
// import FocusCaptureWrapper from './FocusCaptureWrapper.js';
import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
// @ts-ignore
import ModalBackdrop from './ModalBackdrop.js'; // eslint-disable-line no-unused-vars
import OverlayMixin from '../mixins/OverlayMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  DialogModalityMixin(
  // FocusCaptureWrapper(
  KeyboardMixin(
  OverlayMixin(
    ElementBase
  )));


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
 * @mixes OverlayMixin
 * @mixes ShadowTemplateMixin
 */
class Dialog extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host(:not([hidden])) {
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          left: 0;
          outline: none;
          position: fixed;
          top: 0;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }

        #content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          position: relative;
        }
      </style>
      <elix-modal-backdrop id="backdrop""></elix-modal-backdrop>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
