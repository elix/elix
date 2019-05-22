import { applyChildNodes } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Dialog from './Dialog.js';


/**
 * Asks a single question the user can answer with choice buttons
 * 
 * @inherits Dialog
 */
class AlertDialog extends Dialog {

  componentDidMount() {
    super.componentDidMount();
    this.$.buttonContainer.addEventListener('click', async (event) => {
      // TODO: Ignore clicks on buttonContainer background.
      const button = event.target;
      if (button instanceof HTMLElement) {
        const choice = button.textContent;
        this[symbols.raiseChangeEvents] = true; 
        await this.close({ choice });
        this[symbols.raiseChangeEvents] = false;
      }
    });
  }

  /**
   * The buttons created by the component to represent the choices in the
   * [choices](#choices) property.
   * 
   * @type {HTMLElement[]}
   */
  get choiceButtons() {
    return this.state.choiceButtons;
  }

  /**
   * The class, tag, or template used to create the choice buttons.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default 'button'
   */
  get choiceButtonRole() {
    return this.state.choiceButtonRole;
  }
  set choiceButtonRole(choiceButtonRole) {
    this.setState({ choiceButtonRole });
  }

  /**
   * An array of strings indicating the choices the `AlertDialog` will present
   * to the user as responses to the alert. For each string in the array, the
   * `AlertDialog` displays a button labeled with that string.
   * 
   * By default, this is an array with a single choice, "OK".
   * 
   * @type {string[]}
   */
  get choices() {
    return this.state.choices;
  }
  set choices(choices) {
    this.setState({ choices });
  }

  get defaultState() {
    const state = Object.assign(super.defaultState, {
      choiceButtonRole: 'button',
      choiceButtons: [],
      choices: ['OK']
    });

    // When choices or choice button role changes, regenerate buttons.
    state.onChange(['choiceButtonRole', 'choices'], state => {
      const choiceButtons = state.choices.map(choice => {
        const button = template.createElement(state.choiceButtonRole);
        button.textContent = choice;
        return button;
      });
      Object.freeze(choiceButtons);
      return {
        choiceButtons
      };
    });
  
    return state;
  }

  // Let the user select a choice by pressing its initial letter.
  [symbols.keydown](event) {
    let handled = false;

    const key = event.key.length === 1 && event.key.toLowerCase();
    if (key) {
      // See if one of the choices starts with the key.
      const choice = this.choices.find(choice =>
        choice[0].toLowerCase() === key
      );
      if (choice) {
        this.close({
          choice
        });
        handled = true;
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.choiceButtons) {
      applyChildNodes(this.$.buttonContainer, this.state.choiceButtons);
    }
  }

  get [symbols.template]() {
    const result = super[symbols.template];
    const alertDialogTemplate = template.html`
      <style>
        #frame {
          padding: 1em;
        }

        #buttonContainer {
          margin-top: 1em;
        }

        button {
          font-family: inherit;
          font-size: inherit;
        }

        #buttonContainer > :not(:first-child) {
          margin-left: 0.5em;
        }
      </style>
      <div id="alertDialogContent">
        <slot></slot>
        <div id="buttonContainer"></div>
      </div>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, alertDialogTemplate);
    }
    return result;
  }

}


customElements.define('elix-alert-dialog', AlertDialog);
export default AlertDialog;
