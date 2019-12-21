import * as internal from "../../src/internal.js";
import * as template from "../../src/template.js";
import Button from "../../src/Button.js";

class CustomButton extends Button {
  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
      <style>
        #inner {
          background: white;
          border-radius: 0.5em;
          border: 2px solid rgba(255, 0, 0, 0.2);
          padding: 0.5em 1em;
        }
      </style>
    `
    );
  }
}

customElements.define("custom-button", CustomButton);
export default CustomButton;
