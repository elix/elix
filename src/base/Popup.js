import * as internal from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import Overlay from "./Overlay.js";
import PopupModalityMixin from "./PopupModalityMixin.js";

const Base = KeyboardMixin(PopupModalityMixin(Overlay));

/**
 * Lightweight form of modeless overlay that can be easily dismissed
 *
 * When opened, the popup displays its children on top of other page elements.
 *
 * @inherits Overlay
 * @mixes KeyboardMixin
 * @mixes PopupModalityMixin
 */
class Popup extends Base {
  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (changed.backdropPartType) {
      this[internal.ids].backdrop.addEventListener(
        "mousedown",
        mousedownHandler.bind(this)
      );

      // Mobile Safari doesn't seem to generate a mousedown handler on the
      // backdrop in some cases that Mobile Chrome handles. For completeness, we
      // also listen to touchend.
      if (!("PointerEvent" in window)) {
        this[internal.ids].backdrop.addEventListener(
          "touchend",
          mousedownHandler
        );
      }
    }
  }
}

/**
 * @private
 * @param {Event} event
 */
async function mousedownHandler(event) {
  // @ts-ignore
  const element = this;
  element[internal.raiseChangeEvents] = true;
  await element.close();
  element[internal.raiseChangeEvents] = false;
  event.preventDefault();
  event.stopPropagation();
}

export default Popup;
