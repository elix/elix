import * as internal from "../../src/internal.js";
import * as template from "../../src/template.js";
import Button from "../../src/Button.js";

class FocusVisibleTest extends Button {
  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
        <style>
          #inner {
            background: #888;
            border-radius: 3px;
            color: #eee;
            padding: 6px 12px;
          }
        </style>
      `
    );
  }
}

customElements.define("focus-visible-test", FocusVisibleTest);
export default FocusVisibleTest;
