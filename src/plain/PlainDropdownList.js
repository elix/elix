import * as internal from "../base/internal.js";
import DropdownList from "../base/DropdownList.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainMenu from "./PlainMenu.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";

/**
 * DropdownList component in the Plain reference design system
 *
 * @inherits DropdownList
 * @part {PlainMenu} menu
 * @part {PlainPopup} popup
 * @part {PlainBorderButton} source
 * @part {PlainOpenCloseToggle} popup-toggle
 */
class PlainDropdownList extends DropdownList {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      menuPartType: PlainMenu,
      popupPartType: PlainPopup,
      sourcePartType: PlainBorderButton,
      popupTogglePartType: PlainOpenCloseToggle
    });
  }
}

export default PlainDropdownList;
