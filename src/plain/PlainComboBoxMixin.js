import * as internal from "../base/internal.js";
import OpenCloseToggle from "./OpenCloseToggle.js";
import PlainPopup from "./Popup.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * @module PlainComboBoxMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainComboBoxMixin(Base) {
  return class PlainComboBox extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        popupPartType: PlainPopup,
        popupTogglePartType: OpenCloseToggle
      });
    }
  };
}
