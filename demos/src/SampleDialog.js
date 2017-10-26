import Dialog from '../../elements/Dialog.js';
import * as props from '../../mixins/props.js';
import symbols from '../../mixins/symbols.js';


class SampleDialog extends Dialog {

  get props() {
    return props.merge(super.props, {
      $: {
        content: {
          style: {
            padding: '1em'
          }
        }
      }
    });
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    // Have the dialog close itself when the user clicks anywhere within it. In
    // many cases, you'll want to have a button ("OK", "Close", etc.) that
    // performs this action.
    this.$.content.addEventListener('click', () => {
      this.close();
    });
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
