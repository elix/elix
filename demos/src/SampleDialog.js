import { merge } from '../../src/updates.js';
import Dialog from '../../src/Dialog.js';


class SampleDialog extends Dialog {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Have the dialog close itself when the user clicks anywhere within it. In
    // many cases, you'll want to have a button ("OK", "Close", etc.) that
    // performs this action.
    this.$.content.addEventListener('click', () => {
      this.close();
    });
  }

  get updates() {
    return merge(super.updates, {
      $: {
        content: {
          style: {
            padding: '1em'
          }
        }
      }
    });
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
