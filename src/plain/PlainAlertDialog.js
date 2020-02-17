import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import AlertDialog from "../base/AlertDialog.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainModalBackdrop from "./PlainModalBackdrop.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";

class PlainAlertDialog extends AlertDialog {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: PlainModalBackdrop,
      choiceButtonPartType: PlainBorderButton,
      framePartType: PlainOverlayFrame
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #frame {
            padding: 1em;
          }

          #buttonContainer {
            margin-top: 1em;
          }

          #buttonContainer > :not(:first-child) {
            margin-left: 0.5em;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainAlertDialog;
