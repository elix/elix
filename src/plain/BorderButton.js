import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import PlainButton from "./Button.js";

class BorderButton extends PlainButton {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #inner {
            background: #eee;
            border: 1px solid #ddd;
            padding: 0.25em 0.25em;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default BorderButton;
