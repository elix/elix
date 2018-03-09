import './OverlayFrame.js';
import * as symbols from './symbols.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from './KeyboardMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import PopupModalityMixin from './PopupModalityMixin.js';


const frameTagKey = Symbol('frameTag');


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
 * @inherits ElementBase
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes PopupModalityMixin
 */
class Popup extends Base {

  get defaults() {
    return {
      tags: {
        frame: 'elix-overlay-frame'
      }
    };
  }

  get frameTag() {
    return this[frameTagKey];
  }
  set frameTag(frameTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[frameTagKey] = frameTag;
  }

  get [symbols.template]() {
    const frameTag = this.frameTag || this.defaults.tags.frame;
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

        #frame {
          pointer-events: initial;
        }
      </style>
      <${frameTag} id="frame">
        <slot></slot>
      </${frameTag}>
    `;
  }

}


customElements.define('elix-popup', Popup);
export default Popup;
