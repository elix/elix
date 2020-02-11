import * as internal from "../base/internal.js";
import PlainButton from "../plain/Button.js";
import PopupButton from "../base/PopupButton.js";
import PlainOverlayFrame from "./OverlayFrame.js";

class PlainPopupButton extends PopupButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      sourcePartType: PlainButton
    });
  }
}

export default PlainPopupButton;
