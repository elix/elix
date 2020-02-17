import * as internal from "../base/internal.js";
import DropdownList from "../base/DropdownList.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainMenu from "./PlainMenu.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";

/**
 * DropdownList component in the Plain reference design system
 *
 * @inherits DropdownList
 */
class PlainDropdownList extends DropdownList {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      menuPartType: PlainMenu,
      sourcePartType: PlainBorderButton,
      popupTogglePartType: PlainOpenCloseToggle
    });
  }
}

export default PlainDropdownList;
