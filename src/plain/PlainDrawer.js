import Drawer from "../base/Drawer.js";
import PlainDrawerMixin from "./PlainDrawerMixin.js";
import PlainModalOverlayMixin from "./PlainModalOverlayMixin.js";

/**
 * Drawer component in the Plain reference design system
 *
 * @inherits Drawer
 * @mixes PlainModalOverlayMixin
 */
class PlainDrawer extends PlainDrawerMixin(PlainModalOverlayMixin(Drawer)) {}

export default PlainDrawer;
