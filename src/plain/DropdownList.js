import * as internal from "../base/internal.js";
import BorderButton from "./BorderButton.js";
import DropdownList from "../base/DropdownList.js";
import PlainMenu from "./Menu.js";
import PlainOverlayFrame from "./OverlayFrame.js";
import PlainUpDownToggle from "./UpDownToggle.js";

class PlainDropdownList extends DropdownList {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      menuPartType: PlainMenu,
      sourcePartType: BorderButton,
      popupTogglePartType: PlainUpDownToggle
    });
  }
}

export default PlainDropdownList;
