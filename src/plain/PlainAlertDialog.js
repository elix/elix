import * as internal from "../base/internal.js";
import AlertDialog from "../base/AlertDialog.js";
import html from "../core/html.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainModalOverlayMixin from "./PlainModalOverlayMixin.js";

/**
 * AlertDialog component in the Plain reference design system
 *
 * @inherits AlertDialog
 * @mixes PlainModalOverlayMixin
 * @part {PlainBorderButton} choice-button
 */
class PlainAlertDialog extends PlainModalOverlayMixin(AlertDialog) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      choiceButtonPartType: PlainBorderButton
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
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
      `
    );
    return result;
  }
}

export default PlainAlertDialog;
