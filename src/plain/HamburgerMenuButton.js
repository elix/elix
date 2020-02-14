import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import HamburgerMenuButton from "../base/HamburgerMenuButton.js";
import PlainDrawer from "./Drawer.js";

/**
 * @part menu-icon - the icon inside the menu button
 */
class PlainHamburgerMenuButton extends HamburgerMenuButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      menuPartType: PlainDrawer
    });
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Fill the menuButton slot with our icon.
    const menuButtonSlot = result.content.querySelector(
      'slot[name="menuButton"]'
    );
    if (menuButtonSlot) {
      menuButtonSlot.append(
        template.html`
          <slot name="menuIcon">
            <svg id="menuIcon" part="menu-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"></path>
            </svg>
          </slot>
        `.content
      );
    }

    result.content.append(
      template.html`
        <style>
          :host {
            height: 1em;
            width: 1em;
          }

          #menuButton {
            align-items: center;
            display: inline-flex;
            flex: 1;
          }

          #menuIcon {
            display: block;
            height: 24px;
            width: 24px;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainHamburgerMenuButton;
