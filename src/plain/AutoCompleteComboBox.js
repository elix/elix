import * as internal from "../base/internal.js";
import AutoCompleteComboBox from "../base/AutoCompleteComboBox.js";
import OpenCloseToggle from "./OpenCloseToggle.js";
import PlainListBox from "./ListBox.js";
import PlainOverlayFrame from "./OverlayFrame.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainAutoCompleteComboBox extends AutoCompleteComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      popupTogglePartType: OpenCloseToggle,
      listPartType: PlainListBox
    });
  }
}

export default PlainAutoCompleteComboBox;
