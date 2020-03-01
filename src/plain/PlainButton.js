import * as internal from "../base/internal.js";
import Button from "../base/Button.js";
import html from "../core/html.js";

/**
 * Button component in the Plain reference design system
 *
 * @inherits Button
 */
class PlainButton extends Button {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          [part~="inner"] {
            display: inline-flex;
            justify-content: center;
            margin: 0;
            position: relative;
            white-space: nowrap;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainButton;
