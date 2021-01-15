import { defaultState } from "../base/internal.js";
import ListComboBox from "../base/ListComboBox.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";
import PlainListBox from "./PlainListBox.js";

/**
 * ListComboBox component in the Plain reference design system
 *
 * @inherits ListComboBox
 * @part {PlainListBox} list
 */
class PlainListComboBox extends PlainComboBoxMixin(ListComboBox) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      listPartType: PlainListBox,
    });
  }
}

export default PlainListComboBox;
