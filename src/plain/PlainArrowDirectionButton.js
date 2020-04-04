import * as internal from "../base/internal.js";
import DarkModeMixin from "../base/DarkModeMixin.js";
import html from "../core/html.js";
import PlainButton from "./PlainButton.js";

const Base = DarkModeMixin(PlainButton);

/**
 * Left/right arrow button in the Plain reference design system
 *
 * This component is used by
 * [PlainArrowDirectionMixin](PlainArrowDirectionMixin) for its default
 * left/right arrow buttons.
 *
 * @inherits PlainButton
 * @mixes DarkModeMixin
 */
class PlainArrowDirectionButton extends Base {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            color: rgba(0, 0, 0, 0.7);
          }

          :host(:not([disabled]):hover) {
            background: rgba(0, 0, 0, 0.2);
            color: rgba(0, 0, 0, 0.8);
            cursor: pointer;
          }

          :host([disabled]) {
            color: rgba(0, 0, 0, 0.3);
          }

          [part~="inner"] {
            fill: currentcolor;
          }

          :host([dark]) {
            color: rgba(255, 255, 255, 0.7);
          }

          :host([dark]:not([disabled]):hover) {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.8);
          }

          :host([dark][disabled]) {
            color: rgba(255, 255, 255, 0.3);
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainArrowDirectionButton;
