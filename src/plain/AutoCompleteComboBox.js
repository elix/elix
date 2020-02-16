import * as internal from "../base/internal.js";
import AutoCompleteComboBox from "../base/AutoCompleteComboBox.js";
import OpenCloseToggle from "./OpenCloseToggle.js";
import PlainListBox from "./ListBox.js";
import PlainPopup from "./Popup.js";

class PlainAutoCompleteComboBox extends AutoCompleteComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupTogglePartType: OpenCloseToggle,
      popupPartType: PlainPopup,
      listPartType: PlainListBox
    });
  }
}

export default PlainAutoCompleteComboBox;
