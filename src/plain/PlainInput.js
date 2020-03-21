import * as internal from "../base/internal.js";
import html from "../core/html.js";
import Input from "../base/Input.js";

/**
 * ListBox component in the Plain reference design system
 *
 * @inherits ListBox
 */
class PlainInput extends Input {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(html`
      <style>
        :host {
          border: 1px solid gray;
          box-sizing: border-box;
        }

        [part~="inner"] {
          border-color: transparent;
        }
      </style>
    `);
    return result;
  }
}

export default PlainInput;
