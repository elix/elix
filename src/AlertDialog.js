import { getSuperProperty } from './workarounds.js';
import { merge, apply } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Dialog from './Dialog.js';


/**
 * An `AlertDialog` is a form of `Dialog` designed to ask the user a single
 * question and let them respond by clicking one of a small number of buttons
 * labeled with text.
 * 
 * @inherits Dialog
 */
class AlertDialog extends Dialog {

  constructor() {
    super();
    Object.assign(this[symbols.roles], {
      choiceButton: 'button'
    });
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.buttonContainer.addEventListener('click', async (event) => {
      // TODO: Ignore clicks on buttonContainer background.
      const button = event.target;
      if (button instanceof HTMLElement) {
        const result = button.textContent;
        this[symbols.raiseChangeEvents] = true; 
        await this.close(result);
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

  get choiceButtonRole() {
    return this[symbols.roles].choiceButton;
  }
  set choiceButtonRole(choiceButtonRole) {
    this[symbols.hasDynamicTemplate] = true;
    this[symbols.roles].choiceButton = choiceButtonRole;
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
    return Object.assign({}, super.defaultState, {
      choiceButtons: [],
      choices: ['OK']
    });
  }

  // Let the user select a choice by pressing its initial letter.
  [symbols.keydown](event) {
    let handled = false;

    const key = event.key.length === 1 && event.key.toLowerCase();
    if (key) {
      // See if one of the choices starts with the key.
      const choiceForKey = this.choices.find(choice =>
        choice[0].toLowerCase() === key
      );
      if (choiceForKey) {
        this.close(choiceForKey);
        handled = true;
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    if (state.opened && state.choicesForChoiceButtons !== state.choices) {
      // Choices have changed; create new buttons.
      const choiceButtons = state.choices.map(choice => {
        const button = template.createElement(this.choiceButtonRole);
        button.textContent = choice;
        return button;
      });
      Object.freeze(choiceButtons);
      Object.assign(state, {
        choicesForChoiceButtons: state.choices,
        choiceButtons
      });
      result = false;
    }
    return result;
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, AlertDialog, symbols.template);
    apply(result.content, {
      $: {
        frame: {
          style: {
            padding: '1em'
          }
        }
      }
    });
    const alertDialogTemplate = template.html`
      <style>
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
    template.findAndTransmute(result, 'slot:not([name])', alertDialogTemplate);
    return result;
  }

  get updates() {
    const childNodes = this.state.choiceButtons;
    return merge(super.updates, {
      $: {
        buttonContainer: {
          childNodes
        }
      }
    });
  }

}


customElements.define('elix-alert-dialog', AlertDialog);
export default AlertDialog;
