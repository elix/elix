import * as internal from "../base/internal.js";
import FilterComboBox from "../base/FilterComboBox.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";
import PlainFilterListBox from "./FilterListBox.js";

class PlainFilterComboBox extends PlainComboBoxMixin(FilterComboBox) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      listPartType: PlainFilterListBox
    });
  }
}

export default PlainFilterComboBox;
