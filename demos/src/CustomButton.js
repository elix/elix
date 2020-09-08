import Button from "../../src/base/Button.js";
import { template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";

class CustomButton extends Button {
  get [template]() {
    const result = super[template];
    result.content.append(
      templateFrom.html`
        <style>
          [part~=button] {
            background: white;
            border-radius: 0.5em;
            border: 2px solid rgba(255, 0, 0, 0.2);
            padding: 0.5em 1em;
          }
        </style>
      `.content
    );
    return result;
  }
}

customElements.define("custom-button", CustomButton);
export default CustomButton;
