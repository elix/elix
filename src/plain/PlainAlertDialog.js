import AlertDialog from "../base/AlertDialog.js";
import { defaultState, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
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
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      choiceButtonPartType: PlainBorderButton,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          [part~=frame] {
            padding: 1em;
          }

          [part~=choice-button-container] {
            margin-top: 1em;
          }

          [part~=choice-button]:not(:first-child) {
            margin-left: 0.5em;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainAlertDialog;
