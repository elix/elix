import * as internal from "../base/internal.js";
import Popup from "../base/Popup.js";
import PlainBackdrop from "./PlainBackdrop.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";

class PlainPopup extends Popup {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: PlainBackdrop,
      framePartType: PlainOverlayFrame
    });
  }
}

export default PlainPopup;
