import AriaDropdownList from "../base/AriaDropdownList.js";
import { defaultState } from "../base/internal.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainListBox from "./PlainListBox.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";

/**
 * AriaDropdownList component in the Plain reference design system
 *
 * @inherits AriaDropdownList
 * @part {PlainListBox} menu
 * @part {PlainPopup} popup
 * @part {PlainBorderButton} source
 * @part {PlainOpenCloseToggle} popup-toggle
 */
class PlainAriaDropdownList extends AriaDropdownList {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      menuPartType: PlainListBox,
      popupPartType: PlainPopup,
      sourcePartType: PlainBorderButton,
      popupTogglePartType: PlainOpenCloseToggle,
    });
  }
}

export default PlainAriaDropdownList;
