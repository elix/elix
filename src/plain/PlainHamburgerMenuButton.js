import * as internal from "../base/internal.js";
import HamburgerMenuButton from "../base/HamburgerMenuButton.js";
import html from "../core/html.js";
import PlainDrawer from "./PlainDrawer.js";

/**
 * HamburgerMenuButton component in the Plain reference design system
 *
 * @inherits HamburgerMenuButton
 * @part menu-icon - the icon inside the menu button
 * @part {PlainDrawer} menu
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
        html`
          <slot name="menuIcon">
            <svg
              id="menuIcon"
              part="menu-icon"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 3 h18 v2 h-18 z m0 5 h18 v2 h-18 z m0 5 h18 v2 h-18 z"
              ></path>
            </svg>
          </slot>
        `
      );
    }

    result.content.append(
      html`
        <style>
          :host {
            height: 1em;
            width: 1em;
          }

          [part~="menu-button"] {
            align-items: center;
            display: inline-flex;
            flex: 1;
          }

          [part~="menu-icon"] {
            display: block;
            height: 24px;
            width: 24px;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainHamburgerMenuButton;
