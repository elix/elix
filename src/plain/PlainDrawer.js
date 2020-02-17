import * as internal from "../base/internal.js";
import Drawer from "../base/Drawer.js";
import PlainModalBackdrop from "./PlainModalBackdrop.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";

/**
 * Drawer component in the Plain reference design system
 *
 * @inherits Drawer
 */
class PlainDrawer extends Drawer {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: PlainModalBackdrop,
      framePartType: PlainOverlayFrame
    });
  }
}

export default PlainDrawer;
