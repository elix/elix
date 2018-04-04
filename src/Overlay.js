import './OverlayFrame.js';
import * as symbols from './symbols.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import ReactiveElement from './ReactiveElement.js';

const backdropTagKey = Symbol('backdropTag');
const frameTagKey = Symbol('frameTag');


const Base =
  OpenCloseMixin(
  OverlayMixin(
    ReactiveElement
  ));


/**
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 */
class Overlay extends Base {

  get defaults() {
    return {
      tags: {
        backdrop: '',
        frame: 'elix-overlay-frame'
      }
    };
  }

  get backdropTag() {
    return this[backdropTagKey];
  }
  set backdropTag(backdropTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[backdropTagKey] = backdropTag;
  }

  get frameTag() {
    return this[frameTagKey];
  }
  set frameTag(frameTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[frameTagKey] = frameTag;
  }

  get [symbols.template]() {

    const backdropTag = this.backdropTag || this.defaults.tags.backdrop;
    const backdropTemplate = backdropTag ?
      `<${backdropTag} id="backdrop"></${backdropTag}>` :
      '';

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
      ${backdropTemplate}
      <${frameTag} id="frame">
        <slot></slot>
      </${frameTag}>
    `;
  }

}


customElements.define('elix-overlay', Overlay);
export default Overlay;
