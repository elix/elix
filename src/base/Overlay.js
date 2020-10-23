import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { transmute } from "../core/template.js";
import Backdrop from "./Backdrop.js";
import {
  checkSize,
  defaultState,
  ids,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import OverlayFrame from "./OverlayFrame.js";
import OverlayMixin from "./OverlayMixin.js";
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
    return this[ids] && this[ids].backdrop;
  }

  /**
   * The class or tag used for the `backdrop` part - the optional
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
    return this[state].backdropPartType;
  }
  set backdropPartType(backdropPartType) {
    this[setState]({ backdropPartType });
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      backdropPartType: Backdrop,
      framePartType: OverlayFrame,
    });
  }

  get frame() {
    return this[ids].frame;
  }

  /**
   * The class or tag used to create the `frame` part – the overlay's
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
    return this[state].framePartType;
  }
  set framePartType(framePartType) {
    this[setState]({ framePartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    renderParts(this[shadowRoot], this[state], changed);
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    if (changed.opened && this[state].content) {
      // If contents know how to size themselves, ask them to check their size.
      this[state].content.forEach((element) => {
        if (element[checkSize]) {
          element[checkSize]();
        }
      });
    }
  }

  get [template]() {
    const result = super[template];

    // TODO: Consider moving frameContent div to Drawer.
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          display: inline-grid;
          /* Constrain content if overlay's height is constrained. */
          grid-template: minmax(0, 1fr) / minmax(0, 1fr);
          max-height: 100vh;
          max-width: 100vw;
          outline: none;
          position: fixed;
          -webkit-tap-highlight-color: transparent;
        }

        [part~="frame"] {
          box-sizing: border-box;
          display: grid;
          overscroll-behavior: contain;
          pointer-events: initial;
          position: relative;
        }

        #frameContent {
          display: grid;
          overflow: hidden;
        }
      </style>
      <div id="backdrop" part="backdrop" tabindex="-1"></div>
      <div id="frame" part="frame" role="none">
        <div id="frameContent">
          <slot></slot>
        </div>
      </div>
    `);

    renderParts(result.content, this[state]);

    return result;
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.backdropPartType) {
    const { backdropPartType } = state;
    const backdrop = root.getElementById("backdrop");
    if (backdrop) {
      transmute(backdrop, backdropPartType);
    }
  }
  if (!changed || changed.framePartType) {
    const { framePartType } = state;
    const frame = root.getElementById("frame");
    if (frame) {
      transmute(frame, framePartType);
    }
  }
}

export default Overlay;
