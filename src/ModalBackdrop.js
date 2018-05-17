import { merge } from './updates.js';
import Backdrop from './Backdrop.js';


/**
 * A simple backdrop for a modal overlay such as a [Dialog](Dialog) or
 * [Drawer](Drawer). The backdrop slightly obscures the background elements,
 * focusing the user's attention on the overlay.
 * 
 * @inherits ReactiveElement
 */
class ModalBackdrop extends Backdrop {

  get updates() {
    return merge(super.updates, {
      style: {
        background: 'black',
        opacity: 0.2
      }
    });
  }

}


customElements.define('elix-modal-backdrop', ModalBackdrop);
export default ModalBackdrop;
