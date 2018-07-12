import * as symbols from './symbols.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ModalBackdrop from './ModalBackdrop.js';
import Overlay from './Overlay.js'
import { merge } from './updates.js';


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

  constructor() {
    super();
    Object.assign(this.elementDescriptors, {
      backdrop: ModalBackdrop
    });
  }

  get [symbols.template]() {
    const result = super[symbols.template];
    const frame = result.content.querySelector('#frame');
    this[FocusCaptureMixin.wrap](frame);
    return result;
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
