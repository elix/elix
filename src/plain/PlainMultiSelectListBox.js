import * as internal from "../base/internal.js";
import MultiSelectListBox from "../base/MultiSelectListBox.js";
import html from "../core/html.js";

/**
 * MultiSelectListBox component in the Plain reference design system
 *
 * @inherits MultiSelectListBox
 */
class PlainMultiSelectListBox extends MultiSelectListBox {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            border: 1px solid gray;
            box-sizing: border-box;
          }

          ::slotted(*) {
            padding: 0.25em;
          }

          ::slotted([active]) {
            background: highlight;
            color: highlighttext;
          }

          /* ::slotted(*)::before {
            content: "☐";
            display: inline-block;
            font-size: 1.2em;
            margin-right: 0.2em;
          }

          ::slotted([selected])::before {
            content: "☑";
          } */

          @media (pointer: coarse) {
            ::slotted(*) {
              padding: 1em;
            }
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainMultiSelectListBox;
