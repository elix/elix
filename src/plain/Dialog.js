import * as internal from "../base/internal.js";
import Dialog from "../base/Dialog.js";
import PlainModalBackdrop from "./ModalBackdrop.js";
import PlainOverlayFrame from "./OverlayFrame.js";

class PlainDialog extends Dialog {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: PlainModalBackdrop,
      framePartType: PlainOverlayFrame
    });
  }
}

export default PlainDialog;
