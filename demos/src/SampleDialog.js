import Dialog from "../../src/base/Dialog.js";
import * as internal from "../../src/base/internal.js";
import CustomBackdrop from "./CustomBackdrop.js";
import CustomOverlayFrame from "./CustomOverlayFrame.js";

class SampleDialog extends Dialog {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: CustomBackdrop,
      framePartType: CustomOverlayFrame,
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    if (super[internal.render]) {
      super[internal.render](changed);
    }
    if (changed.framePartType) {
      // Have the dialog close itself when the user clicks anywhere within it. In
      // many cases, you'll want to have a button ("OK", "Close", etc.) that
      // performs this action.
      this[internal.ids].frame.addEventListener("click", () => {
        this.close();
      });
    }
  }
}

customElements.define("sample-dialog", SampleDialog);
export default SampleDialog;
