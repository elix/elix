import './ModalBackdrop.js';
import { merge } from './updates.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import Overlay from './Overlay.js'


const Base =
  DialogModalityMixin(
  FocusCaptureMixin(
  KeyboardMixin(
    Overlay
  )));


/**
 * This component presents its children as a basic modal dialog which appears on
 * top of the main page content and which the user must interact with before
 * they can return to the page.
 * 
 * @inherits Overlay
 * @mixes DialogModalityMixin
 * @mixes KeyboardMixin
 * @elementtag {ModalBackdrop} backdrop
 */
class Dialog extends Base {

  get defaults() {
    const base = super.defaults;
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        backdrop: 'elix-modal-backdrop'
      })
    });
  }

  get frameTemplate() {
    const base = super.frameTemplate;
    return this[FocusCaptureMixin.inject](base);
  }

  get updates() {
    return merge(super.updates, {
      style: {
        'pointer-events': 'initial'
      }
    });
  }

}


customElements.define('elix-dialog', Dialog);
export default Dialog;
