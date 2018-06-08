import './Backdrop.js';
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
 * An element that appears over other page elements. The main overlay content is
 * presented within a frame on top of an optional backdrop.
 * 
 * The overlay logic is provided by [OverlayMixin](OverlayMixin). `Overlay` adds
 * the definition of customizable element tags: [frameTag](#frameTag) for the
 * frame around the overlay content, and [backdropTag](#backdropTag) (if
 * defined) for the optional element covering the page elements behind the
 * overlay.
 * 
 * See [Dialog](Dialog) and [Popup](Popup) for modal and modeless subclasses,
 * respectively.
 * 
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @elementtag {Backdrop} backdrop
 * @elementtag {OverlayFrame} frame
 */
class Overlay extends Base {

  get backdropTemplate() {
    const backdropTag = this.backdropTag || this.defaults.tags.backdrop;
    return backdropTag ?
      `<${backdropTag} id="backdrop"></${backdropTag}>` :
      '';
  }

  get defaults() {
    return {
      tags: {
        backdrop: 'elix-backdrop',
        frame: 'elix-overlay-frame'
      }
    };
  }

  /**
   * The tag used to create the optional backdrop element behind the overlay.
   * 
   * This can help focus the user's attention on the overlay content.
   * Additionally, a backdrop can be used to absorb clicks on background page
   * elements. For example, [Dialog](Dialog) uses [ModalBackdrop](ModalBackdrop)
   * as an overlay backdrop in such a way.
   * 
   * @type {string}
   * @default ''
   */
  get backdropTag() {
    return this[backdropTagKey];
  }
  set backdropTag(backdropTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[backdropTagKey] = backdropTag;
  }

  /**
   * The tag used to contain the primary overlay content.
   * 
   * The frame element can be used to provide a border around the overlay
   * content, and to provide visual effects such as a drop-shadow to help
   * distinguish overlay content from background page elements.
   * 
   * @type {string}
   * @default 'elix-overlay-frame'
   */
  get frameTag() {
    return this[frameTagKey];
  }
  set frameTag(frameTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[frameTagKey] = frameTag;
  }

  get frameTemplate() {
    const frameTag = this.frameTag || this.defaults.tags.frame;
    return `
      <${frameTag} id="frame" role="none">
        <slot></slot>
      </${frameTag}>
    `;
  }

  get [symbols.template]() {
    const backdropTemplate = this.backdropTemplate;
    const frameTemplate = this.frameTemplate;
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
          position: fixed;
          top: 0;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }

        #frame {
          box-sizing: border-box;
          max-height: 100vh;
          max-width: 100vw;
          pointer-events: initial;
        }
      </style>
      ${backdropTemplate}
      ${frameTemplate}
    `;
  }

}


customElements.define('elix-overlay', Overlay);
export default Overlay;
