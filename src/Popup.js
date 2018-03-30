import Overlay from './Overlay.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupModalityMixin from './PopupModalityMixin.js';


const Base =
  KeyboardMixin(
  PopupModalityMixin(
    Overlay
  ));


/**
 * A `Popup` is a lightweight form of overlay that, when opened, displays its
 * children on top of other page elements.
 * 
 * @inherits Overlay
 * @mixes KeyboardMixin
 * @mixes PopupModalityMixin
 */
class Popup extends Base {}


customElements.define('elix-popup', Popup);
export default Popup;
