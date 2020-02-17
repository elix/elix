import * as internal from "../base/internal.js";
import html from "../core/html.js";
import Menu from "../base/Menu.js";

/**
 * Menu component in the Plain reference design system
 *
 * @inherits Menu
 */
class PlainMenu extends Menu {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
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
