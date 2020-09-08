import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainButton from "./PlainButton.js";

/**
 * Button with a border in the Plain reference design system
 *
 * @inherits PlainButton
 */
class PlainBorderButton extends PlainButton {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          [part~=button] {
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
