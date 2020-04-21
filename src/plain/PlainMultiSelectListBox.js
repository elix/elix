import MultiSelectListBox from "../base/MultiSelectListBox.js";
import PlainListBoxMixin from "./PlainListBoxMixin.js";

/**
 * MultiSelectListBox component in the Plain reference design system
 *
 * @inherits MultiSelectListBox
 */
class PlainMultiSelectListBox extends PlainListBoxMixin(MultiSelectListBox) {}

export default PlainMultiSelectListBox;
