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

  // @ts-ignore
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

    // Using a grid here is tricky, because we want to deliver size-to-content
    // and expand-to-container sizing here. We also want to apply `overflow:
    // hidden` to the frame for use in a popup source like ListComboBox with a
    // popup that needs to scroll. However, tHe presence of `overflow` will
    // cause a grid at the viewport's right edge to *not* size to content as
    // expected, which will throw off our popup layout heuristics because they
    // can't get the real intrinsic size of the popup by looking at the popup
    // itself.
    //
    // To work around that, PopupSource must have special logic to inspect the
    // frame's intrinsic size directly. We'd prefer to avoid such entanglements
    // when we can, but after much experimentation with both grid and block
    // styling, grid seemed to minimize the amount of trickery needed.
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          display: grid;
          grid-template: minmax(0, max-content) / minmax(0, max-content);
          max-height: 100vh;
          max-width: 100vw;
          outline: none;
          position: fixed;
          -webkit-tap-highlight-color: transparent;
        }

        [part~="frame"] {
          box-sizing: border-box;
          display: block;
          display: grid;
          overflow: hidden;
          overscroll-behavior: contain;
          pointer-events: initial;
          position: relative;
        }

        /* Move to Drawer. */
        /* #frameContent {
          display: block;
          max-height: 100%;
          max-width: 100%;
          overflow: hidden;
        } */
      </style>
      <div id="backdrop" part="backdrop" tabindex="-1"></div>
      <div id="frame" part="frame" role="none">
        <slot></slot>
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
