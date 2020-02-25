import Dialog from "../base/Dialog.js";
import PlainModalOverlayMixin from "./PlainModalOverlayMixin.js";

/**
 * Dialog component in the Plain reference design system
 *
 * @inherits Dialog
 * @mixes PlainModalOverlayMixin
 */
class PlainDialog extends PlainModalOverlayMixin(Dialog) {}

export default PlainDialog;
