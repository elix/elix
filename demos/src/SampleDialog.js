import './CustomBackdrop.js';
import './CustomOverlayFrame.js';
import Dialog from '../../src/Dialog.js';


class SampleDialog extends Dialog {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Have the dialog close itself when the user clicks anywhere within it. In
    // many cases, you'll want to have a button ("OK", "Close", etc.) that
    // performs this action.
    this.$.frame.addEventListener('click', () => {
      this.close();
    });
  }

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        backdrop: 'custom-backdrop',
        frame: 'custom-overlay-frame'
      })
    });
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
