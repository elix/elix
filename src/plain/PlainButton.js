import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import Button from "../base/Button.js";

class PlainButton extends Button {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #inner {
            display: inline-flex;
            justify-content: center;
            margin: 0;
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
