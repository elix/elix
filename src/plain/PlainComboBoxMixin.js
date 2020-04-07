import * as internal from "../base/internal.js";
import html from "../core/html.js";
import PlainInput from "./PlainInput.js";
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
      return Object.assign(super[internal.defaultState] || {}, {
        inputPartType: PlainInput,
        popupPartType: PlainPopup,
        popupTogglePartType: PlainOpenCloseToggle
      });
    }

    [internal.render](changed) {
      super[internal.render](changed);

      // Style the inner input.
      if (changed.inputPartType) {
        // We want to style the inner input if it's been created with
        // WrappedStandardElement, otherwise style the input directly.
        const cast = /** @type {any} */ (this[internal.ids].input);
        const input = "inner" in cast ? cast.inner : cast;
        Object.assign(input.style, {
          outline: "none"
        });
      }
    }

    get [internal.template]() {
      const result = super[internal.template];
      result.content.append(html`
        <style>
          :host {
            background: white;
            border: 1px solid gray;
            box-sizing: border-box;
          }

          [part~="source"] {
            z-index: 2; /* So it's on top of popup */
          }

          [part~="input"] {
            background: transparent;
            border: none;
          }
        </style>
      `);
      return result;
    }
  };
}
