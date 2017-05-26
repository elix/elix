import Dialog from '../../elements/Dialog.js';
import symbols from '../../mixins/symbols.js';


class SampleDialog extends Dialog {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.$.overlayContent.addEventListener('click', () => {
      this.close('OK');
    });
  }

  [symbols.template](fills = {}) {
    const template = `
      <style>
        #message {
          padding: 1em;
        }
      </style>
      <div id="message">
        ${fills.default || `<slot></slot>`}
      </div>
    `
    return super[symbols.template]({ default: template });
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
