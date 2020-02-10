import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import MenuBase from "../base/Menu.js";

class Menu extends MenuBase {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
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
      `.content
    );
    return result;
  }
}

export default Menu;
