import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import Button from "../base/Button.js";

/**
 * A button with no border or background in its normal state.
 *
 * `Button` is useful for clickable subelements inside a more complex
 * component.
 *
 * @inherits Button
 */
class PlainButton extends Button {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #inner {
            background: #eee;
            border: 1px solid #ddd;
            display: inline-flex;
            justify-content: center;
            margin: 0;
            padding: 0.25em 0.5em;
            position: relative;
            white-space: nowrap;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainButton;
