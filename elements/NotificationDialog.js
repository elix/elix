import Dialog from './Dialog.js';
import renderArrayAsElements from '../mixins/renderArrayAsElements.js';
import Symbol from '../mixins/Symbol.js';
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
    return baseTemplate.replace(`<slot></slot>`, injectTemplate);
  }

}


customElements.define('elix-notification-dialog', NotificationDialog);
export default NotificationDialog;
