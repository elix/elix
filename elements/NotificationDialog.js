import Dialog from './Dialog.js';
import renderArrayAsElements from '../mixins/renderArrayAsElements.js';
import symbols from '../mixins/symbols.js';


const choices = Symbol('choices');


class NotificationDialog extends Dialog {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.$.buttonContainer.addEventListener('click', event => {
      // TODO: Ignore clicks on buttonContainer background.
      const button = event.target;
      this.close(button.textContent);
    });
  }

  get choices() {
    return this[choices];
  }
  set choices(choices) {
    this[choices] = choices;
    const slot = this.shadowRoot.querySelector('slot[name="buttons"]');
    renderArrayAsElements(choices, slot, (choice, button) => {
      if (!button) {
        button = document.createElement('button');
      }
      button.textContent = choice;
      return button;
    });
  }

  static get OK() {
    return ['OK'];
  }

  static get OK_CANCEL() {
    return ['OK', 'Cancel'];
  }

  get [symbols.template]() {
    let baseTemplate = super[symbols.template];
    if (baseTemplate instanceof HTMLTemplateElement) {
      baseTemplate = baseTemplate.innerHTML; // Downgrade to string.
    }
    const contentTemplate = `
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

        button:not(:first-child) {
          margin-left: 0.25em;
        }
      </style>
      <div id="container">
        <slot></slot>
        <div id="buttonContainer">
          <slot name="buttons"><button>OK</button></slot>
        </div>
      </div>
    `;
    return baseTemplate.replace(`<slot></slot>`, contentTemplate);
  }

}


customElements.define('elix-notification-dialog', NotificationDialog);
export default NotificationDialog;
