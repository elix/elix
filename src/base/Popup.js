import { fragmentFrom } from "../core/htmlLiterals.js";
import { ids, raiseChangeEvents, render, template } from "./internal.js";
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
  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.backdropPartType) {
      this[ids].backdrop.addEventListener(
        "mousedown",
        mousedownHandler.bind(this)
      );

      // Mobile Safari doesn't seem to generate a mousedown handler on the
      // backdrop in some cases that Mobile Chrome handles. For completeness, we
      // also listen to touchend.
      if (!("PointerEvent" in window)) {
        this[ids].backdrop.addEventListener("touchend", mousedownHandler);
      }
    }
  }

  get [template]() {
    const result = super[template];

    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            display: grid;
            grid-template: minmax(0, max-content) / minmax(0, max-content);
          }
        </style>
      `
    );

    return result;
  }
}

/**
 * @private
 * @param {Event} event
 */
async function mousedownHandler(event) {
  // @ts-ignore
  const element = this;
  element[raiseChangeEvents] = true;
  await element.close({
    canceled: "mousedown outside",
  });
  element[raiseChangeEvents] = false;
  event.preventDefault();
  event.stopPropagation();
}

export default Popup;
