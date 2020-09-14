import DropdownList from "../base/DropdownList.js";
import { defaultState } from "../base/internal.js";
import PopupToggleMixin from "../base/PopupToggleMixin.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainOptionList from "./PlainOptionList.js";
import PlainPopup from "./PlainPopup.js";

/**
 * DropdownList component in the Plain reference design system
 *
 * @inherits DropdownList
 * @part {PlainBorderButton} source
 * @part {PlainOptionList} list
 * @part {PlainOpenCloseToggle} popup-toggle
 * @part {PlainPopup} popup
 * @mixes PopupToggleMixin
 */
class PlainDropdownList extends PopupToggleMixin(DropdownList) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      listPartType: PlainOptionList,
      popupPartType: PlainPopup,
      sourcePartType: PlainBorderButton,
      popupTogglePartType: PlainOpenCloseToggle,
    });
  }
}

export default PlainDropdownList;
