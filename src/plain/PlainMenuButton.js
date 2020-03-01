import * as internal from "../base/internal.js";
import html from "../core/html.js";
import MenuButton from "../base/MenuButton.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainMenu from "./PlainMenu.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";

/**
 * MenuButton component in the Plain reference design system
 *
 * @inherits MenuButton
 * @part {PlainMenu} menu
 * @part {PlainPopup} popup
 * @part {PlainOpenCloseToggle} popup-toggle
 * @part {PlainBorderButton} source
 */
class PlainMenuButton extends MenuButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      menuPartType: PlainMenu,
      popupPartType: PlainPopup,
      popupTogglePartType: PlainOpenCloseToggle,
      sourcePartType: PlainBorderButton
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          [part~="menu"] {
            background: window;
            border: none;
            padding: 0.5em 0;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainMenuButton;
