import SpinBox from "../base/SpinBox.js";
import PlainSpinBoxMixin from "./PlainSpinBoxMixin.js";

/**
 * SpinBox component in the Plain reference design system
 *
 * @inherits SpinBox
 * @mixes PlainSpinBoxMixin
 */
class PlainSpinBox extends PlainSpinBoxMixin(SpinBox) {}

export default PlainSpinBox;
