import * as symbols from '../../src/symbols.js';
import CustomBackdrop from './CustomBackdrop.js';
import CustomOverlayFrame from './CustomOverlayFrame.js';
import Dialog from '../../src/Dialog.js';


class SampleDialog extends Dialog {

  [symbols.beforeUpdate]() {
    const frameChanged = this[symbols.renderedRoles].frameRole !== this.state.frameRole;
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (frameChanged) {
      // Have the dialog close itself when the user clicks anywhere within it. In
      // many cases, you'll want to have a button ("OK", "Close", etc.) that
      // performs this action.
      this.$.frame.addEventListener('click', () => {
        this.close();
      });
      this[symbols.renderedRoles].frameRole = this.state.frameRole;
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      backdropRole: CustomBackdrop,
      frameRole: CustomOverlayFrame
    });
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
