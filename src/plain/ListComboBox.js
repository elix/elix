import * as internal from "../base/internal.js";
import ListComboBox from "../base/ListComboBox.js";
import OpenCloseToggle from "./OpenCloseToggle.js";
import PlainPopup from "./Popup.js";

class PlainListComboBox extends ListComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupPartType: PlainPopup,
      popupTogglePartType: OpenCloseToggle
    });
  }
}

export default PlainListComboBox;
