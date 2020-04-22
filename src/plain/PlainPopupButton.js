import * as internal from "../base/internal.js";
import PopupButton from "../base/PopupButton.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainPopup from "./PlainPopup.js";

/**
 * PopupButton component in the Plain reference design system
 *
 * @inherits PopupButton
 * @part {PlainPopup} popup
 * @part {PlainBorderButton} source
 */
class PlainPopupButton extends PopupButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupPartType: PlainPopup,
      sourcePartType: PlainBorderButton,
    });
  }
}

export default PlainPopupButton;
