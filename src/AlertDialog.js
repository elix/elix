import { merge } from './updates.js';
import * as symbols from './symbols.js';
import Dialog from './Dialog.js';


const choiceButtonsKey= Symbol('choiceButtons');
const choiceButtonTagKey = Symbol('choiceButtonTag');
const previousChoicesKey = Symbol('previousChoices');


/**
 * An `AlertDialog` is a form of `Dialog` designed to ask the user a single
 * question and let them respond by clicking one of a small number of buttons
 * labeled with text.
 * 
 * @inherits Dialog
 * 
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
  get choiceButtons() {
    if (this.choices !== this[previousChoicesKey]) {
      // Items have changed; create new buttons set.
      const choiceButtonTag = this.choiceButtonTag || this.defaults.tags.choiceButton;
      this[choiceButtonsKey] = this.choices.map(choice => {
        const button = document.createElement(choiceButtonTag);
        button.textContent = choice;
        return button;
      });
      // Make the array immutable.
      Object.freeze(this[choiceButtonsKey]);
      this[previousChoicesKey] = this.choices;
    }
    return this[choiceButtonsKey];
  }

  get choiceButtonTag() {
    return this[choiceButtonTagKey];
  }
  set choiceButtonTag(choiceButtonTag) {
    this[choiceButtonTagKey] = choiceButtonTag;
  }

  /**
   * The choices to present to the user.
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

        #choiceButtonsSlot > :not(:first-child),
        #choiceButtonsSlot::slotted(:not(:first-child)) {
          margin-left: 0.5em;
        }
      </style>
      <div id="alertDialogContent">
        <slot></slot>
        <div id="buttonContainer">
          <slot id="choiceButtonsSlot" name="choiceButtons"></slot>
        </div>
      </div>
    `);
  }

  get updates() {
    return merge(super.updates, {
      $: {
        choiceButtonsSlot: {
          childNodes: this.choiceButtons
        }
      }
    });
  }

}


customElements.define('elix-alert-dialog', AlertDialog);
export default AlertDialog;
