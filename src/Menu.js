import * as internal from "./internal.js";
import * as template from "./template.js";
import MenuBase from "./MenuBase.js";

class Menu extends MenuBase {
  get [internal.template]() {
    return template.concat(
      super[internal.template],
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
      `
    );
  }
}

export default Menu;
