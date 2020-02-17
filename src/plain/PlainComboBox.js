import ComboBox from "../base/ComboBox.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";

/**
 * ComboBox component in the Plain reference design system.
 *
 * @inherits ComboBox
 * @mixes PlainComboBoxMixin
 */
class PlainComboBox extends PlainComboBoxMixin(ComboBox) {}

export default PlainComboBox;
