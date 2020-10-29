import {
  defaultState,
  ids,
  render,
  state,
  template
} from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import PlainInput from "./PlainInput.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";

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
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        inputPartType: PlainInput,
        popupPartType: PlainPopup,
        popupTogglePartType: PlainOpenCloseToggle,
      });
    }

    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }

      // Style the inner input.
      if (changed.inputPartType) {
        // We want to style the inner input if it's been created with
        // WrappedStandardElement, otherwise style the input directly.
        const cast = /** @type {any} */ (this[ids].input);
        const input = "inner" in cast ? cast.inner : cast;
        Object.assign(input.style, {
          outline: "none",
        });
      }

      // We don't want the box-shadow on the popup to appear over the input. To
      // avoid this, we create a clip-path on the popup. This clip path has the
      // shape of a rectangle 10px bigger than the popup frame (to account for
      // the box-shadow) with a cut-out piece. If the popup is positioned below
      // the input, the top of the shape will be cut out to avoid rendering over
      // the input. The resulting shape looks like this Unicode character: 凹.
      //
      // Likewise, if the popup is positioned below the input, a piece will be
      // cut out of the bottom of the shape to avoid rendering over the input.
      //
      // TODO: The cut-out arrangement is optimized for combo boxes with a
      // horizontal alignment of "stretch". For combo boxes with start/end or
      // left/right, we should adjust the position and width of the cut-out to
      // match the input.
      if (changed.opened || changed.popupLayout) {
        const { opened, popupLayout } = this[state];
        const direction = popupLayout ? popupLayout.direction : null;
        const w = `10px`; // Width of box shadow
        const popupBelow = direction === "column" || direction === "below";
        const popupAbove = direction === "column-reverse" || direction === "above";
        const clipPath =
          popupBelow
            ? `polygon(0px 0px, 100% 0px, 100% -${w}, calc(100% + ${w}) -${w}, calc(100% + ${w}) calc(100% + ${w}), -${w} calc(100% + ${w}), -${w} -${w}, 0px -${w})`
            : 
            popupAbove ? 
            `polygon(-${w} -${w}, calc(100% + ${w}) -${w}, calc(100% + ${w}) calc(100% + ${w}), 100% calc(100% + ${w}), 100% 100%, 0px 100%, 0px calc(100% + ${w}), -${w} calc(100% + ${w}))`
            : "";
        this[ids].popup.style.clipPath = opened ? clipPath : "";
      }
    }

    get [template]() {
      const result = super[template];
      result.content.append(fragmentFrom.html`
        <style>
          :host {
            background: white;
            border: 1px solid gray;
            box-sizing: border-box;
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
