import Button from "../../src/base/Button.js";
import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";

class CustomButton extends Button {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          [part~="inner"] {
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
