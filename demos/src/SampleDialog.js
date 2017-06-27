import Dialog from '../../elements/Dialog.js';
import symbols from '../../mixins/symbols.js';


class SampleDialog extends Dialog {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.shadowRoot.querySelector('#overlayContent').addEventListener('click', () => {
      this.close('OK');
    });
  }

  [symbols.template](filler) {
    return super[symbols.template](`
      <style>
        #message {
          padding: 1em;
        }
      </style>
      <div id="message">
        ${filler || `<slot></slot>`}
      </div>
    `);
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
