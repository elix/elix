import Dialog from '../../elements/Dialog.js';
import symbols from '../../mixins/symbols.js';


class SampleDialog extends Dialog {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.$.overlayContent.addEventListener('click', () => {
      this.close('OK');
    });
  }

  get [symbols.template]() {
    // Inject our template into the base template.
    let baseTemplate = super[symbols.template];
    if (baseTemplate instanceof HTMLTemplateElement) {
      baseTemplate = baseTemplate.innerHTML; // Downgrade to string.
    }
    const contentTemplate = `
      <style>
        #message {
          padding: 1em;
        }
      </style>
      <div id="message">
        <slot></slot>
      </div>
    `;
    return baseTemplate.replace(`<slot></slot>`, contentTemplate);
  }

}


customElements.define('sample-dialog', SampleDialog);
export default SampleDialog;
