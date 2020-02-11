import * as internal from "../base/internal.js";
import Drawer from "../base/Drawer.js";
import PlainOverlayFrame from "./OverlayFrame.js";

class PlainDrawer extends Drawer {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame
    });
  }
}

export default PlainDrawer;
