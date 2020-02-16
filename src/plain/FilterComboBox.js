import * as internal from "../base/internal.js";
import FilterComboBox from "../base/FilterComboBox.js";
import OpenCloseToggle from "./OpenCloseToggle.js";
import PlainFilterListBox from "./FilterListBox.js";
import PlainPopup from "./Popup.js";

class PlainFilterComboBox extends FilterComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupPartType: PlainPopup,
      popupTogglePartType: OpenCloseToggle,
      listPartType: PlainFilterListBox
    });
  }
}

export default PlainFilterComboBox;
