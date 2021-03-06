import { updateChildNodes } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { createElement } from "../core/template.js";
import Dialog from "./Dialog.js";
import {
  defaultState,
  firstRender,
  ids,
  keydown,
  raiseChangeEvents,
  render,
  setState,
  state,
  stateEffects,
  template,
} from "./internal.js";

/**
 * Asks a single question the user can answer with choice buttons
 *
 * @inherits Dialog
 * @part {button} choice-button - a button representing a choice
 * @part {div} choice-button-container - the container for the choice buttons
 */
class AlertDialog extends Dialog {
  /**
   * The buttons created by the component to represent the choices in the
   * [choices](#choices) property.
   *
   * @type {HTMLElement[]}
   */
  get choiceButtons() {
    return this[state].choiceButtons;
  }

  /**
   * The class or tag used to create the `choice-button` parts —
   * the set of choices shown to the user.
   *
   * @type {PartDescriptor}
   * @default 'button'
   */
  get choiceButtonPartType() {
    return this[state].choiceButtonPartType;
  }
  set choiceButtonPartType(choiceButtonPartType) {
    this[setState]({ choiceButtonPartType });
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
    return this[state].choices;
  }
  set choices(choices) {
    this[setState]({ choices });
  }

  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      choiceButtonPartType: "button",
      choiceButtons: [],
      choices: ["OK"],
    });
  }

  // Let the user select a choice by pressing its initial letter.
  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled = false;

    const key = event.key.length === 1 && event.key.toLowerCase();
    if (key) {
      // See if one of the choices starts with the key.
      const choice = this.choices.find(
        (choice) => choice[0].toLowerCase() === key
      );
      if (choice) {
        this.close({
          choice,
        });
        handled = true;
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event)) || false;
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].choiceButtonContainer.addEventListener(
        "click",
        async (event) => {
          // TODO: Ignore clicks on choiceButtonContainer background.
          const button = event.target;
          if (button instanceof HTMLElement) {
            const choice = button.textContent;
            this[raiseChangeEvents] = true;
            await this.close({ choice });
            this[raiseChangeEvents] = false;
          }
        }
      );
    }

    if (changed.choiceButtons) {
      updateChildNodes(
        this[ids].choiceButtonContainer,
        this[state].choiceButtons
      );
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When choices or choice button part type changes, regenerate buttons.
    if (changed.choiceButtonPartType || changed.choices) {
      /** @type {string[]} */ const choices = state.choices;
      const choiceButtons = choices.map((choice) => {
        const button = createElement(state.choiceButtonPartType);
        if ("part" in button) {
          /** @type {any} */ (button).part = "choice-button";
        }
        button.textContent = choice;
        return button;
      });
      Object.freeze(choiceButtons);
      Object.assign(effects, {
        choiceButtons,
      });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];
    // Replace the default slot with a new default slot and a button container.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <div id="alertDialogContent">
          <slot></slot>
          <div id="choiceButtonContainer" part="choice-button-container"></div>
        </div>
      `);
    }
    return result;
  }
}

export default AlertDialog;
