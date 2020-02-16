import * as internal from "../base/internal.js";
import AutoCompleteComboBox from "../base/AutoCompleteComboBox.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";
import PlainListBox from "./ListBox.js";

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
