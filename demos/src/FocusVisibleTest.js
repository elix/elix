import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import Button from "../../src/base/Button.js";

class FocusVisibleTest extends Button {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          [part~="inner"] {
            background: #888;
            border-radius: 3px;
            color: #eee;
            padding: 6px 12px;
          }
        </style>
      `.content
    );
    return result;
  }
}

customElements.define("focus-visible-test", FocusVisibleTest);
export default FocusVisibleTest;
