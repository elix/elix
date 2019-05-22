import Overlay from './Overlay.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupModalityMixin from './PopupModalityMixin.js';
import * as symbols from './symbols.js';


const Base =
  KeyboardMixin(
  PopupModalityMixin(
    Overlay
  ));


/**
 * Lightweight form of modeless overlay that can be easily dismissed
 * 
 * When opened, the popup displays its children on top of other page elements.
 * 
 * @inherits Overlay
 * @mixes KeyboardMixin
 * @mixes PopupModalityMixin
 */
class Popup extends Base {

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.backdropRole) {
      const mousedownHandler = async event => {
        this[symbols.raiseChangeEvents] = true;
        await this.close();
        this[symbols.raiseChangeEvents] = false;
        event.preventDefault();
        event.stopPropagation();
      };
      this.$.backdrop.addEventListener('mousedown', mousedownHandler);

      // Mobile Safari doesn't seem to generate a mousedown handler on the
      // backdrop in some cases that Mobile Chrome handles. For completeness, we
      // also listen to touchend.
      if (!('PointerEvent' in window)) {
        this.$.backdrop.addEventListener('touchend', mousedownHandler);
      }
    }
  }

}


customElements.define('elix-popup', Popup);
export default Popup;
