import DialogModalityMixin from './DialogModalityMixin.js';
import ElementBase from './ElementBase.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
// @ts-ignore
import ModalBackdrop from './ModalBackdrop.js'; // eslint-disable-line no-unused-vars
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import symbols from './symbols.js';


const Base =
  DialogModalityMixin(
  FocusCaptureMixin(
  KeyboardMixin(
  OpenCloseMixin(
  OverlayMixin(
    ElementBase
  )))));


/**
 * This component presents its children as a basic modal dialog which appears on
 * top of the main page content and which the user must interact with before
 * they can return to the page.
 * 
 * Dialog uses `BackdropWrapper` to add a backdrop behind the main overlay
 * content. Both the backdrop and the dialog itself can be styled.
 * 
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 */
class Dialog extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
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
      <elix-modal-backdrop id="backdrop"></elix-modal-backdrop>
      ${this.wrapWithFocusCapture(`
        <div id="content">
          <slot></slot>
        </div>
      `)}
    `;
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
