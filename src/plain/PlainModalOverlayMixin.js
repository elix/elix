import * as internal from "../base/internal.js";
import PlainModalBackdrop from "./PlainModalBackdrop.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Modal overlay styles for the Plain reference design system
 *
 * @module PlainModalOverlayMixin
 * @part {PlainModalBackdrop} backdrop
 * @part {PlainOverlayFrame} frame
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainModalOverlayMixin(Base) {
  return class PlainModalOverlay extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        backdropPartType: PlainModalBackdrop,
        framePartType: PlainOverlayFrame
      });
    }
  };
}
