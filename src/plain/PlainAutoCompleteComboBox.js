import * as internal from "../base/internal.js";
import AutoCompleteComboBox from "../base/AutoCompleteComboBox.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";
import PlainListBox from "./PlainListBox.js";

/**
 * AutoCompleteComboBox component in the Plain reference design system
 *
 * @inherits AutoCompleteComboBox
 * @mixes PlainComboBoxMixin
 * @part {PlainListBox} list
 */
class PlainAutoCompleteComboBox extends PlainComboBoxMixin(
  AutoCompleteComboBox
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      listPartType: PlainListBox
    });
  }
}

export default PlainAutoCompleteComboBox;
