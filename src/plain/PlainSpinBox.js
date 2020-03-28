import PlainSpinBoxMixin from "./PlainSpinBoxMixin.js";
import SpinBox from "../base/SpinBox.js";

/**
 * SpinBox component in the Plain reference design system
 *
 * @inherits SpinBox
 * @mixes PlainSpinBoxMixin
 */
class PlainSpinBox extends PlainSpinBoxMixin(SpinBox) {}

export default PlainSpinBox;
