// import FocusCaptureWrapper from './FocusCaptureWrapper.js';
import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import ElementBase from './ElementBase.js';
import FocusCaptureMixin from '../mixins/FocusCaptureMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
// @ts-ignore
import ModalBackdrop from './ModalBackdrop.js'; // eslint-disable-line no-unused-vars
import OverlayMixin from '../mixins/OverlayMixin.js';
import symbols from '../utilities/symbols.js';


const Base =
  DialogModalityMixin(
  FocusCaptureMixin(
  KeyboardMixin(
  OverlayMixin(
    ElementBase
  ))));


/**
 * This component presents its children as a basic modal dialog which appears on
 * top of the main page content and which the user must interact with before
 * they can return to the page.
 * 
 * Dialog uses `BackdropWrapper` to add a backdrop behind the main overlay
 * content. Both the backdrop and the dialog itself can be styled.
 * 
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
    /*
     * Note: The simplest way to ensure the backdrop goes behind the content is
     * to put the backdrop first in the document order. However, this seems to
     * confuse the polyfill in IE. As a workaround, we put the backdrop after
     * the content in the document order, then set a z-index on the content to
     * put it over the backdrop.
     */
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
          z-index: 1;
        }
      </style>
      ${this.wrapWithFocusCapture(`
        <div id="content">
          <slot></slot>
        </div>
      `)}
      <elix-modal-backdrop id="backdrop"></elix-modal-backdrop>
    `;
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
