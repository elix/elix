import * as internal from "../base/internal.js";
import html from "../core/html.js";
import PlainButton from "./PlainButton.js";

/**
 * Button with a border in the Plain reference design system
 *
 * @inherits PlainButton
 */
class PlainBorderButton extends PlainButton {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          [part~="inner"] {
            background: #eee;
            border: 1px solid #ccc;
            padding: 0.25em 0.5em;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainBorderButton;
