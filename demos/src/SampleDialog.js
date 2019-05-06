import * as symbols from '../../src/symbols.js';
import CustomBackdrop from './CustomBackdrop.js';
import CustomOverlayFrame from './CustomOverlayFrame.js';
import Dialog from '../../src/Dialog.js';


class SampleDialog extends Dialog {

  [symbols.populate](state, changed) {
    if (super[symbols.populate]) { super[symbols.populate](state, changed); }
    if (changed.frameRole) {
      // Have the dialog close itself when the user clicks anywhere within it. In
      // many cases, you'll want to have a button ("OK", "Close", etc.) that
      // performs this action.
      this.$.frame.addEventListener('click', () => {
        this.close();
      });
    }
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      backdropRole: CustomBackdrop,
      frameRole: CustomOverlayFrame
    });
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
