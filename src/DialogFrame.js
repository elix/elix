import * as symbols from './symbols.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import OverlayFrame from './OverlayFrame.js';


const Base =
  FocusCaptureMixin(
    OverlayFrame
  );


/**
 * A simple frame for an overlay that displays a drop-shadow.
 * 
 * @inherits OverlayFrame
 * @mixes FocusCaptureMixin
 */
class DialogFrame extends Base {

  get [symbols.template]() {
    const base = super[symbols.template];
    return base.replace('<slot></slot>',
      this[FocusCaptureMixin.inject](`<slot></slot>`));
  }

}


customElements.define('elix-dialog-frame', DialogFrame);
export default DialogFrame;
