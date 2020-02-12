import * as internal from "../base/internal.js";
import FilterComboBox from "../base/FilterComboBox.js";
import PlainUpDownToggle from "./UpDownToggle.js";
import PlainOverlayFrame from "./OverlayFrame.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainFilterComboBox extends FilterComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      popupTogglePartType: PlainUpDownToggle
    });
  }
}

export default PlainFilterComboBox;
