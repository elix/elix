import OverlayFrame from './OverlayFrame.js';
import { merge } from './updates.js';


class PopupFrame extends OverlayFrame {

  get updates() {
    return merge(super.updates, {
      style: {
        padding: 0,
        width: '100%'
      }
    });
  }

}


customElements.define('elix-popup-frame', PopupFrame);
export default PopupFrame;
