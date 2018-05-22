import './Backdrop';
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
 * A `Popup` is a lightweight form of overlay that, when opened, displays its
 * children on top of other page elements.
 * 
 * @inherits Overlay
 * @mixes KeyboardMixin
 * @mixes PopupModalityMixin
 */
class Popup extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.backdrop.addEventListener('mousedown', async event => {
      this[symbols.raiseChangeEvents] = true;
      await this.close();
      this[symbols.raiseChangeEvents] = false;
      event.preventDefault();
      event.stopPropagation();
    });
  }

  get defaults() {
    const base = super.defaults;
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        backdrop: 'elix-backdrop'
      })
    });
  }

}


customElements.define('elix-popup', Popup);
export default Popup;
