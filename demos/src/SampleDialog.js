import Dialog from '../../elements/Dialog.js';
import symbols from '../../mixins/symbols.js';


class SampleDialog extends Dialog {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.$.okButton.addEventListener('click', () => {
      this.close('OK');
    });
  }

  get [Dialog.contentTemplateKey]() {
    let baseTemplate = super[Dialog.contentTemplateKey];
    if (baseTemplate instanceof HTMLTemplateElement) {
      baseTemplate = baseTemplate.innerHTML; // Downgrade to string.
    }
    return `
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
        ${baseTemplate}
        <div id="buttonContainer">
          <button id="okButton">OK</button>
        </div>
      </div>
    `;
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
