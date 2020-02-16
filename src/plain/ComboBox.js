import * as internal from "../base/internal.js";
import ComboBox from "../base/ComboBox.js";
import OpenCloseToggle from "./OpenCloseToggle.js";
import PlainPopup from "./Popup.js";

class PlainComboBox extends ComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupPartType: PlainPopup,
      popupTogglePartType: OpenCloseToggle
    });
  }
}

export default PlainComboBox;
