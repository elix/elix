import CustomBackdrop from './CustomBackdrop.js';
import CustomOverlayFrame from './CustomOverlayFrame.js';
import Dialog from '../../src/Dialog.js';


class SampleDialog extends Dialog {

  constructor() {
    super();
    Object.assign(this.elementDescriptors, {
      backdrop: CustomBackdrop,
      frame: CustomOverlayFrame
    });
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Have the dialog close itself when the user clicks anywhere within it. In
    // many cases, you'll want to have a button ("OK", "Close", etc.) that
    // performs this action.
    this.$.frame.addEventListener('click', () => {
      this.close();
    });
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
