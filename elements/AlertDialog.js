import Dialog from './Dialog.js';
import renderArrayAsElements from '../mixins/renderArrayAsElements.js';
import Symbol from '../mixins/Symbol.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import symbols from '../mixins/symbols.js';


const choicesKey = Symbol('choices');


/**
 * An `AlertDialog` is a form of `Dialog` designed to ask the user a single
 * question and let them respond by clicking one of a small number of buttons
 * labeled with text.
 * 
 * @extends {Dialog}
 * @mixes ShadowReferencesMixin
 */
class AlertDialog extends ShadowReferencesMixin(Dialog) {

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    this.$.buttonContainer.addEventListener('click', event => {
      // TODO: Ignore clicks on buttonContainer background.
      if (event.target instanceof HTMLElement) {
        const button = event.target;
        this.close(button.textContent);
      }
    });
  }

  /**
   * An array of strings indicating the choices the `AlertDialog` will present
   * to the user as responses to the alert. For each string in the array, the
   * `AlertDialog` displays a button labeled with that string.
   * 
   * You can use any strings for the choices. `AlertDialog` provides static
   * properties offering two simple arrays of choices for common situations:
   * 
   * * `OK`: an array with the single choice "OK".
   * * `OK_CANCEL`: an array with two choices, "OK" and “Cancel”.
   * 
   * You can use these to set the `choices` property, or you can provide custom
   * choices:
   * 
   *     // Create an OK/Cancel alert.
   *     const alert = new AlertDialog();
   *     alert.choices = AlertDialog.OK_CANCEL;
   *  
   * @type {string[]}
   */
  get choices() {
    return this[choicesKey];
  }
  /**
   * @param {string[]} choices - The choices to present to the user
   */
  set choices(choices) {
    this[choicesKey] = choices;
    if (!this.shadowRoot) {
      console.warn(`NotificationDialog couldn't find its own shadowRoot.`);
      return;
    }
    const slot = this.shadowRoot.querySelector('slot[name="buttons"]');
    if (!slot) {
      console.warn(`NotificationDialog couldn't find its default slot.`);
      return;
    }
    renderArrayAsElements(choices, slot, (choice, button) => {
      if (!button) {
        button = document.createElement('button');
      }
      button.textContent = choice;
      return button;
    });
  }

  // Let the user select a choice by pressing its initial letter.
  [symbols.keydown](event) {
    let handled = false;

    // Loop over choices to see if one of them starts with the key.
    // TODO: Loop over buttons instead of choices?
    let found = false;
    let index = 0;
    while (index < this.choices.length && !found) {
      if (this.choices[index].charCodeAt(0) === event.keyCode) {
        found = true;
      } else {
        index++;
      }
    }
    if (found && index >= 0) {
      this.close(this.choices[index]);
      handled = true;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  /**
   * An array with a single item: the string "OK".
   * 
   * @type {string[]}
   */
  static get OK() {
    return ['OK'];
  }

  /**
   * An array containing two strings: "OK" and "Cancel".
   * 
   * @type {string[]}
   */
  static get OK_CANCEL() {
    return ['OK', 'Cancel'];
  }

  [symbols.template](fillers = {}) {
    const defaultFiller = typeof fillers === 'string' ?
      fillers :
      fillers.default || `<slot></slot>`;
    const buttonFiller = fillers.buttons || `<slot name="buttons"><button>OK</button></slot>`;
    return super[symbols.template](`
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
        ${defaultFiller}
        <div id="buttonContainer">
          ${buttonFiller}
        </div>
      </div>
    `);
  }

}


customElements.define('elix-alert-dialog', AlertDialog);
export default AlertDialog;
