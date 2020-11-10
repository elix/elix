import FilterComboBox from "../base/FilterComboBox.js";
import { defaultState } from "../base/internal.js";
import PlainAutoCompleteInput from "./PlainAutoCompleteInput.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";
import PlainFilterListBox from "./PlainFilterListBox.js";

/**
 * FilterComboBox component in the Plain reference design system
 *
 * @inherits FilterComboBox
 * @part {PlainFilterListBox} list
 */
class PlainFilterComboBox extends PlainComboBoxMixin(FilterComboBox) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      inputPartType: PlainAutoCompleteInput,
      listPartType: PlainFilterListBox,
    });
  }
}

export default PlainFilterComboBox;
