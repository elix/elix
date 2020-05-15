import { template } from "../base/internal.js";
import Menu from "../base/Menu.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * Menu component in the Plain reference design system
 *
 * @inherits Menu
 */
class PlainMenu extends Menu {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host ::slotted(*) {
            padding: 0.25em;
          }
          :host ::slotted([selected]) {
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

export default PlainMenu;
