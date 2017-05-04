import Dialog from '../../elements/Dialog.js';
import symbols from '../../mixins/symbols.js';


class SampleDialog extends Dialog {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.$.okButton.addEventListener('click', () => {
      this.close('OK');
    });
  }

  get [symbols.template]() {
    const baseTemplate = super[symbols.template];
    const injectTemplate = `
      <style>
        #container {
          padding: 1em;
        }

        #buttonContainer {
          margin-top: 1em;
        }

        button {
          font-family: inherit;
          font-size: inherit;
        }
      </style>
      <div id="container">
        <slot></slot>
        <div id="buttonContainer">
          <button id="okButton">OK</button>
        </div>
      </div>
    `;
    return baseTemplate.replace(`<slot></slot>`, injectTemplate);
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
