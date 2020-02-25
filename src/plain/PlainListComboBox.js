import * as internal from "../base/internal.js";
import ListComboBox from "../base/ListComboBox.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";

/**
 * ListComboBox component in the Plain reference design system
 *
 * @inherits SlidingStage
 * @part {PlainPopup} popup
 * @part {PlainOpenCloseToggle} popup-toggle
 */
class PlainListComboBox extends ListComboBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      popupPartType: PlainPopup,
      popupTogglePartType: PlainOpenCloseToggle
    });
  }
}

export default PlainListComboBox;
