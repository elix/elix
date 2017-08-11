import Dialog from '../../elements/Dialog.js';
import symbols from '../../mixins/symbols.js';


class SampleDialog extends Dialog {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    // Have the dialog close itself when the user clicks anywhere within it. In
    // many cases, you'll want to have a button ("OK", "Close", etc.) that
    // performs this action.
    this.shadowRoot.querySelector('#overlayContent').addEventListener('click', () => {
      this.close('OK');
    });
  }

  [symbols.template]() {
    return super[symbols.template](`
      <style>
        #message {
          padding: 1em;
        }
      </style>
      <div id="message">
        <slot></slot>
      </div>
    `);
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
