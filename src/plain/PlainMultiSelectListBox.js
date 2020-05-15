import { template } from "../base/internal.js";
import MultiSelectListBox from "../base/MultiSelectListBox.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * MultiSelectListBox component in the Plain reference design system
 *
 * @inherits MultiSelectListBox
 */
class PlainMultiSelectListBox extends MultiSelectListBox {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
