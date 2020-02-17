import * as internal from "../base/internal.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";
import PopupButton from "../base/PopupButton.js";

/**
 * PopupButton component in the Plain reference design system
 *
 * @inherits PopupButton
 */
class PlainPopupButton extends PopupButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      sourcePartType: PlainBorderButton
    });
  }
}

export default PlainPopupButton;
