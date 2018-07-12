import { merge } from './updates.js';
import * as symbols from './symbols.js';
import Dialog from './Dialog.js';


const choiceButtonTagKey = Symbol('choiceButtonTag');


/**
 * An `AlertDialog` is a form of `Dialog` designed to ask the user a single
 * question and let them respond by clicking one of a small number of buttons
 * labeled with text.
 * 
 * @inherits Dialog
 */
class AlertDialog extends Dialog {

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

  get choiceButtonTag() {
    return this[choiceButtonTagKey];
  }
  set choiceButtonTag(choiceButtonTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[choiceButtonTagKey] = choiceButtonTag;
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

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        choiceButton: base.tags && base.tags.choiceButton || 'button'
      })
    });
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

    // Loop over choices to see if one of them starts with the key.
    // TODO: Loop over buttons instead of choices?
    let found = false;
    let index = 0;
    while (index < this.choices.length && !found) {
      if (event.key.length === 1 && this.choices[index][0] === event.key) {
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

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    if (state.choicesForChoiceButtons !== state.choices) {
      // Choices have changed; create new buttons.
      const choiceButtonTag = this.choiceButtonTag || this.defaults.tags.choiceButton;
      const choiceButtons = state.choices.map(choice => {
        const button = document.createElement(choiceButtonTag);
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
    const base = super[symbols.template];
    return base.replace('<slot></slot>', `
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
    `);
  }

  get updates() {
    const childNodes = this.state.choiceButtons;
    return merge(super.updates, {
      $: {
        buttonContainer: {
          childNodes
        },
        frame: {
          style: {
            padding: '1em'
          }
        }
      }
    });
  }

}


customElements.define('elix-alert-dialog', AlertDialog);
export default AlertDialog;
