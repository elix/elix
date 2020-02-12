import * as internal from "../base/internal.js";
import Drawer from "../base/Drawer.js";
import PlainModalBackdrop from "./ModalBackdrop.js";
import PlainOverlayFrame from "./OverlayFrame.js";

class PlainDrawer extends Drawer {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: PlainModalBackdrop,
      framePartType: PlainOverlayFrame
    });
  }
}

export default PlainDrawer;
