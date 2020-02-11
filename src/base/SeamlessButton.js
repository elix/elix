import * as internal from "./internal.js";
import * as template from "../core/template.js";
import Button from "./Button.js";

/**
 * A button with no border or background in its normal state.
 *
 * `SeamlessButton` is useful for clickable subelements inside a more complex
 * component.
 *
 * @inherits Button
 */
class SeamlessButton extends Button {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #inner {
            background: none;
            border: none;
            padding: 0;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default SeamlessButton;
