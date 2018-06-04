import './DialogFrame.js';
import './ModalBackdrop.js';
import { merge } from './updates.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import Overlay from './Overlay.js'


const Base =
  DialogModalityMixin(
  KeyboardMixin(
    Overlay
  ));


/**
 * This component presents its children as a basic modal dialog which appears on
 * top of the main page content and which the user must interact with before
 * they can return to the page.
 * 
 * @inherits Overlay
 * @mixes DialogModalityMixin
 * @mixes KeyboardMixin
 * @elementtag {ModalBackdrop} backdrop
 * @elementtag {DialogFrame} frame
 */
class Dialog extends Base {

  get defaults() {
    const base = super.defaults;
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        backdrop: 'elix-modal-backdrop',
        frame: 'elix-dialog-frame'
      })
    });
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
