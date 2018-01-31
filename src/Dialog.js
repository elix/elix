import './ModalBackdrop.js';
import './OverlayFrame.js';
import * as symbols from './symbols.js';
import CustomTagsMixin from './CustomTagsMixin.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';


const Base =
  CustomTagsMixin(  
  DialogModalityMixin(
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
 * @inherits ElementBase
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * 
 */
class Dialog extends Base {

  get tags() {
    const base = super.tags || {};
    return Object.assign({}, super.tags, {
      backdrop: base.backdrop || 'elix-modal-backdrop',
      frame: base.frame || 'elix-overlay-frame'
    });
  }
  set tags(tags) {
    super.tags = tags;
  }

  get [symbols.template]() {
    const backdropTag = this.tags.backdrop;
    const frameTag = this.tags.frame;
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
      </style>
      <${backdropTag} id="backdrop"></${backdropTag}>
      <${frameTag} id="frame">
        <slot></slot>
      </${frameTag}>
    `;
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
