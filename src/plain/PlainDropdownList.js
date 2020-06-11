import DropdownList from "../base/DropdownList.js";
import { defaultState } from "../base/internal.js";
import PlainListbox from "./PlainListBox.js"

/**
 * DropdownList component in the Plain reference design system
 *
 * @inherits DropdownList
 * @part {PlainListbox} list
 */
class PlainDropdownList extends DropdownList {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      // inputPartType: 'input',
      listPartType: PlainListbox,
    });
  }
}

export default PlainDropdownList;
