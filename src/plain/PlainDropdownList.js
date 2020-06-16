import DropdownList from "../base/DropdownList.js";
import { defaultState } from "../base/internal.js";
import PlainListbox from "./PlainListBox.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";

/**
 * DropdownList component in the Plain reference design system
 *
 * @inherits DropdownList
 * @part {PlainListbox} list
 */
class PlainDropdownList extends PlainComboBoxMixin(DropdownList) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      listPartType: PlainListbox,
    });
  }
}

export default PlainDropdownList;
