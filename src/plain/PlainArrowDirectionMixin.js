import * as internal from "../base/internal.js";
import html from "../core/html.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * ArrowDirectionMixin styles in the Plain reference design system
 *
 * @module PlainArrowDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {PlainArrowDirectionButton} arrow-button
 * @part arrow-icon - both of the default arrow icons used in the arrow buttons
 * @part arrow-icon-next - the arrow icon that points to the next item
 * @part arrow-icon-previous - the arrow icon that points to the previous item
 */
export default function PlainArrowDirectionMixin(Base) {
  return class PlainArrowDirection extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        arrowButtonPartType: PlainArrowDirectionButton
      });
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      super[internal.render](changed);

      // Rotate the default icons for vertical orientation, flip the default
      // icons for right-to-left.
      if (changed.orientation || changed.rightToLeft) {
        const { orientation, rightToLeft } = this[internal.state];
        const vertical = orientation === "vertical";
        const transform = vertical
          ? "rotate(90deg)"
          : rightToLeft
          ? "rotateZ(180deg)"
          : "";
        if (this[internal.ids].arrowIconPrevious) {
          this[internal.ids].arrowIconPrevious.style.transform = transform;
        }
        if (this[internal.ids].arrowIconNext) {
          this[internal.ids].arrowIconNext.style.transform = transform;
        }
      }
    }

    get [internal.template]() {
      const result = super[internal.template];

      // Insert our icons into the button slots.
      const arrowButtonPrevious = result.content.querySelector(
        'slot[name="arrowButtonPrevious"]'
      );
      if (arrowButtonPrevious) {
        arrowButtonPrevious.append(
          html`
            <svg
              id="arrowIconPrevious"
              part="arrow-icon arrow-icon-previous"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              style="fill: currentColor; height: 1em; width: 1em;"
            >
              <g>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </g>
            </svg>
          `
        );
      }
      const arrowButtonNext = result.content.querySelector(
        'slot[name="arrowButtonNext"]'
      );
      if (arrowButtonNext) {
        arrowButtonNext.append(
          html`
            <svg
              id="arrowIconNext"
              part="arrow-icon arrow-icon-next"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              style="fill: currentColor; height: 1em; width: 1em;"
            >
              <g>
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </g>
            </svg>
          `
        );
      }

      return result;
    }
  };
}
