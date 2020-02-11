import * as internal from "../base/internal.js";
import BorderButton from "../plain/BorderButton.js";
import PopupButton from "../base/PopupButton.js";
import PlainOverlayFrame from "./OverlayFrame.js";

class PlainPopupButton extends PopupButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      sourcePartType: BorderButton
    });
  }
}

export default PlainPopupButton;
