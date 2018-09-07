import * as symbols from './symbols.js';
import * as template from './template.js';
import Backdrop from './Backdrop.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayFrame from './OverlayFrame.js';
import OverlayMixin from './OverlayMixin.js';
import ReactiveElement from './ReactiveElement.js';


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
 * @elementrole {Backdrop} backdrop
 * @elementrole {OverlayFrame} frame
 */
class Overlay extends Base {

  constructor() {
    super();
    this[symbols.roles] = Object.assign({}, this[symbols.roles], {
      backdrop: Backdrop,
      frame: OverlayFrame
    });
  }

  get backdrop() {
    return this.$ && this.$.backdrop;
  }

  /**
   * The class, tag, or template used for the optional backdrop element behind
   * the overlay.
   * 
   * This can help focus the user's attention on the overlay content.
   * Additionally, a backdrop can be used to absorb clicks on background page
   * elements. For example, [Dialog](Dialog) uses [ModalBackdrop](ModalBackdrop)
   * as an overlay backdrop in such a way.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default Backdrop
   */
  get backdropRole() {
    return this[symbols.roles].backdrop;
  }
  set backdropRole(backdropRole) {
    this[symbols.hasDynamicTemplate] = true;
    this[symbols.roles].backdrop = backdropRole;
  }

  get frame() {
    return this.$ && this.$.frame;
  }

  /**
   * The class, tag, or template used to contain the primary overlay content.
   * 
   * The frame element can be used to provide a border around the overlay
   * content, and to provide visual effects such as a drop-shadow to help
   * distinguish overlay content from background page elements.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default OverlayFrame
   */
  get frameRole() {
    return this[symbols.roles].frame;
  }
  set frameRole(frameRole) {
    this[symbols.hasDynamicTemplate] = true;
    this[symbols.roles].frame = frameRole;
  }

  get [symbols.template]() {
    const result = template.html`
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          left: 0;
          height: 100%;
          max-height: 100vh;
          max-width: 100vw;
          outline: none;
          position: fixed;
          -webkit-tap-highlight-color: transparent;
          top: 0;
          width: 100%;
        }

        #frame {
          box-sizing: border-box;
          max-height: 100%;
          max-width: 100%;
          overscroll-behavior: contain;
          pointer-events: initial;
        }
      </style>
      <div id="backdrop"></div>
      <div id="frame" role="none">
        <slot></slot>
      </div>
    `;
    template.findAndReplace(result, '#backdrop', this.backdropRole);
    template.findAndReplace(result, '#frame', this.frameRole);
    return result;
  }

}


customElements.define('elix-overlay', Overlay);
export default Overlay;
