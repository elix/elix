import * as symbols from './symbols.js';
import * as template from './template.js';
import Backdrop from './Backdrop.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayFrame from './OverlayFrame.js';
import OverlayMixin from './OverlayMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SlotContentMixin from './SlotContentMixin.js';


/** @type {any} */
const appendedToDocumentKey = Symbol('appendedToDocument');


// TODO: We'd like to use DelegateFocusMixin in this component, but see the note
// at OverlayMixin's openedChanged function.
const Base =
  OpenCloseMixin(
  OverlayMixin(
  SlotContentMixin(
    ReactiveElement
  )));


/**
 * An element that appears over other page elements
 * 
 * The main overlay content is presented within a frame on top of an optional
 * backdrop.
 * 
 * The overlay logic is provided by [OverlayMixin](OverlayMixin). `Overlay` adds
 * the definition of customizable element tags: [frameTag](#frameTag) for the
 * frame around the overlay content, and [backdropTag](#backdropTag) (if
 * defined) for the optional element covering the page elements behind the
 * overlay.
 * 
 * As a convenience, the `open` method of `Overlay` will automatically add the
 * overlay to the end of the document body if the overlay isn't already in the
 * document. If the overlay is automatically attached in this way, then when it
 * closes, it will automatically be removed.
 * 
 * See [Dialog](Dialog) and [Popup](Popup) for modal and modeless subclasses,
 * respectively.
 * 
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes SlotContentMixin
 * @elementrole {Backdrop} backdrop
 * @elementrole {OverlayFrame} frame
 */
class Overlay extends Base {

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
    return this.state.backdropRole;
  }
  set backdropRole(backdropRole) {
    this.setState({ backdropRole });
  }

  componentDidUpdate(changed) {
    super.componentDidUpdate(changed);
    if (changed.opened && this.state.content) {
      // If contents know how to size themselves, ask them to check their size.
      this.state.content.forEach(element => {
        if (element[symbols.checkSize]) {
          element[symbols.checkSize]();
        }
      });
    }
    // If we're finished closing an overlay that was automatically added to the
    // document, remove it now. Note: we only do this when the component
    // updates, not when it mounts, because we don't want an automatically-added
    // element to be immediately removed during its connectedCallback.
    if (this.closeFinished && this[appendedToDocumentKey]) {
      this[appendedToDocumentKey] = false;
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      backdropRole: Backdrop,
      frameRole: OverlayFrame
    });
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
    return this.state.frameRole;
  }
  set frameRole(frameRole) {
    this.setState({ frameRole });
  }

  async open() {
    if (!this.isConnected) {
      // Overlay isn't in document yet.
      this[appendedToDocumentKey] = true;
      document.body.appendChild(this);
    }
    if (super.open) { await super.open(); }
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.backdropRole) {
      template.transmute(this.$.backdrop, this.state.backdropRole);
    }
    if (changed.frameRole) {
      template.transmute(this.$.frame, this.state.frameRole);
    }
  }

  get [symbols.template]() {
    return template.html`
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
      <elix-backdrop id="backdrop" tabindex="-1"></elix-backdrop>
      <elix-overlay-frame id="frame" role="none">
        <slot></slot>
      </elix-overlay-frame>
    `;
  }

}


customElements.define('elix-overlay', Overlay);
export default Overlay;
