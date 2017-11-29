import ElementBase from './ElementBase.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import PopupModalityMixin from './PopupModalityMixin.js';
import symbols from './symbols.js';


const Base =
  KeyboardMixin(
  OpenCloseMixin(
  OverlayMixin(
  PopupModalityMixin(
    ElementBase
  ))));


/**
 * A `Popup` is a lightweight form of overlay that, when opened, displays its
 * children on top of other page elements.
 * 
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes PopupModalityMixin
 */
class Popup extends Base {

  get [symbols.template]() {
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
          pointer-events: none;
          position: fixed;
          top: 0;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }

        #content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          pointer-events: initial;
          position: relative;
        }
      </style>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('elix-popup', Popup);
export default Popup;
