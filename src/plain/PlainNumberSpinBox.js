import NumberSpinBox from "../base/NumberSpinBox.js";
import PlainSpinBoxMixin from "./PlainSpinBoxMixin.js";

/**
 * NumberSpinBox component in the Plain reference design system
 *
 * @inherits NumberSpinBox
 * @mixes PlainSpinBoxMixin
 */
class PlainNumberSpinBox extends PlainSpinBoxMixin(NumberSpinBox) {}

export default PlainNumberSpinBox;
