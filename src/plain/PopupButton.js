import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import Button from "../base/Button.js";
import PopupButton from "../base/PopupButton.js";
import PlainOverlayFrame from "./OverlayFrame.js";

class PlainPopupButton extends PopupButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: PlainOverlayFrame,
      sourcePartType: Button
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #source {
            background: buttonface;
            color: inherit;
            font: inherit;
            margin: 0;
            padding: 0.25em 0.5em;
            white-space: nowrap;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainPopupButton;
