import { defaultState } from "../base/internal.js";
import PopupButton from "../base/PopupButton.js";
import PopupToggleMixin from "../base/PopupToggleMixin.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainPopup from "./PlainPopup.js";

/**
 * PopupButton component in the Plain reference design system
 *
 * @inherits PopupButton
 * @part {PlainPopup} popup
 * @part {PlainBorderButton} source
 */
class PlainPopupButton extends PopupToggleMixin(PopupButton) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      popupPartType: PlainPopup,
      sourcePartType: PlainBorderButton,
    });
  }
}

export default PlainPopupButton;
