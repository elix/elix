import * as internal from "../base/internal.js";
import FilterComboBox from "../base/FilterComboBox.js";
import OpenCloseToggle from "./OpenCloseToggle.js";
import PlainOverlayFrame from "./OverlayFrame.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainFilterComboBox extends FilterComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      popupTogglePartType: OpenCloseToggle
    });
  }
}

export default PlainFilterComboBox;
