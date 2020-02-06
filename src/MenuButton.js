import * as internal from "./internal.js";
import * as template from "./template.js";
import Menu from "./Menu.js";
import MenuButtonBase from "./MenuButtonBase.js";

class MenuButton extends MenuButtonBase {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      menuPartType: Menu
    });
  }

  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
        <style>
          #menu {
            background: window;
            border: none;
            padding: 0.5em 0;
          }
        </style>
      `
    );
  }
}

export default MenuButton;
