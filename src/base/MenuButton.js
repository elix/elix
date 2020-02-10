import * as internal from "./internal.js";
import * as template from "../core/template.js";
import Menu from "./Menu.js";
import MenuButtonBase from "./MenuButtonBase.js";

class MenuButton extends MenuButtonBase {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      menuPartType: Menu
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.append(
      template.html`
        <style>
          #menu {
            background: window;
            border: none;
            padding: 0.5em 0;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default MenuButton;
