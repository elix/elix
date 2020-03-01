import * as internal from "./internal.js";
import * as template from "../core/template.js";
import Backdrop from "./Backdrop.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import OverlayFrame from "./OverlayFrame.js";
import OverlayMixin from "./OverlayMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SlotContentMixin from "./SlotContentMixin.js";

// TODO: We'd like to use DelegateFocusMixin in this component, but see the note
// at OverlayMixin's openedChanged function.
const Base = OpenCloseMixin(OverlayMixin(SlotContentMixin(ReactiveElement)));

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
 * @part {Backdrop} backdrop - the backdrop behind the overlay
 * @part {OverlayFrame} frame - the frame around the overlay
 */
class Overlay extends Base {
  get backdrop() {
    return this[internal.ids] && this[internal.ids].backdrop;
  }

  /**
   * The class, tag, or template used for the `backdrop` part - the optional
   * element shown behind the overlay.
   *
   * This can help focus the user's attention on the overlay content.
   * Additionally, a backdrop can be used to absorb clicks on background page
   * elements. For example, [Dialog](Dialog) uses [ModalBackdrop](ModalBackdrop)
   * as an overlay backdrop in such a way.
   *
   * @type {PartDescriptor}
   * @default Backdrop
   */
  get backdropPartType() {
    return this[internal.state].backdropPartType;
  }
  set backdropPartType(backdropPartType) {
    this[internal.setState]({ backdropPartType });
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);
    if (changed.opened && this[internal.state].content) {
      // If contents know how to size themselves, ask them to check their size.
      this[internal.state].content.forEach(element => {
        if (element[internal.checkSize]) {
          element[internal.checkSize]();
        }
      });
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: Backdrop,
      framePartType: OverlayFrame
    });
  }

  get frame() {
    return this[internal.ids].frame;
  }

  /**
   * The class, tag, or template used to create the `frame` part – the overlay's
   * primary content.
   *
   * The frame element can be used to provide a border around the overlay
   * content, and to provide visual effects such as a drop-shadow to help
   * distinguish overlay content from background page elements.
   *
   * @type {PartDescriptor}
   * @default OverlayFrame
   */
  get framePartType() {
    return this[internal.state].framePartType;
  }
  set framePartType(framePartType) {
    this[internal.setState]({ framePartType });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.backdropPartType) {
      template.transmute(
        this[internal.ids].backdrop,
        this[internal.state].backdropPartType
      );
    }
    if (changed.framePartType) {
      template.transmute(
        this[internal.ids].frame,
        this[internal.state].framePartType
      );
    }
  }

  get [internal.template]() {
    // TODO: Consider moving frameContent div to Drawer.
    return template.html`
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-height: 100vh;
          max-width: 100vw;
          outline: none;
          position: fixed;
          -webkit-tap-highlight-color: transparent;
        }

        [part~="frame"] {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          max-height: 100%;
          max-width: 100%;
          overscroll-behavior: contain;
          pointer-events: initial;
          position: relative;
        }

        #frameContent {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          width: 100%;
        }
      </style>
      <div id="backdrop" part="backdrop" tabindex="-1"></div>
      <div id="frame" part="frame" role="none">
        <div id="frameContent">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

export default Overlay;
