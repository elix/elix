import './ModalBackdrop.js';
import './OverlayFrame.js';
import * as symbols from './symbols.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';


const backdropTagKey = Symbol('backdropTag');
const frameTagKey = Symbol('frameTag');


const Base =
  DialogModalityMixin(
  KeyboardMixin(
  OpenCloseMixin(
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
 * @inherits ElementBase
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureMixin
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * 
 */
class Dialog extends Base {

  get defaultTags() {
    return {
      backdrop: 'elix-modal-backdrop',
      frame: 'elix-overlay-frame'
    };
  }

  get backdropTag() {
    return this[backdropTagKey];
  }
  set backdropTag(backdropTag) {
    this[backdropTagKey] = backdropTag;
  }

  get frameTag() {
    return this[frameTagKey];
  }
  set frameTag(frameTag) {
    this[frameTagKey] = frameTag;
  }

  get [symbols.template]() {
    const backdropTag = this.backdropTag || this.defaultTags.backdrop;
    const frameTag = this.frameTag || this.defaultTags.frame;
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
