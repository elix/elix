import * as internal from "../base/internal.js";
import FilterComboBox from "../base/FilterComboBox.js";
import ComboBoxToggleButton from "./ComboBoxToggleButton.js";
import PlainOverlayFrame from "./OverlayFrame.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainFilterComboBox extends FilterComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      toggleButtonPartType: ComboBoxToggleButton
    });
  }
}

export default PlainFilterComboBox;
