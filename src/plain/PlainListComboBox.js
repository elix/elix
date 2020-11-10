import { defaultState } from "../base/internal.js";
import ListComboBox from "../base/ListComboBox.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";

/**
 * ListComboBox component in the Plain reference design system
 *
 * @inherits ListComboBox
 * @part {PlainPopup} popup
 * @part {PlainOpenCloseToggle} popup-toggle
 */
class PlainListComboBox extends ListComboBox {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      popupPartType: PlainPopup,
      popupTogglePartType: PlainOpenCloseToggle,
    });
  }
}

export default PlainListComboBox;
