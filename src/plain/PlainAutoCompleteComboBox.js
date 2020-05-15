import AutoCompleteComboBox from "../base/AutoCompleteComboBox.js";
import { defaultState } from "../base/internal.js";
import PlainAutoCompleteInput from "./PlainAutoCompleteInput.js";
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
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      inputPartType: PlainAutoCompleteInput,
      listPartType: PlainListBox,
    });
  }
}

export default PlainAutoCompleteComboBox;
