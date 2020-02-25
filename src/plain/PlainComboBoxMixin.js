import * as internal from "../base/internal.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * ComboBox styles for the Plain reference design system
 *
 * @module PlainComboBoxMixin
 * @part {PlainPopup} popup
 * @part {PlainOpenCloseToggle} popup-toggle
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainComboBoxMixin(Base) {
  return class PlainComboBox extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        popupPartType: PlainPopup,
        popupTogglePartType: PlainOpenCloseToggle
      });
    }
  };
}
