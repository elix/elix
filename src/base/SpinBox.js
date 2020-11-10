import { forwardFocus } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { transmute } from "../core/template.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import DisabledMixin from "./DisabledMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import {
  defaultState,
  goDown,
  goUp,
  ids,
  inputDelegate,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";

const Base = DelegateFocusMixin(
  DelegateInputLabelMixin(
    DelegateInputSelectionMixin(
      DisabledMixin(
        FocusVisibleMixin(
          FormElementMixin(
            KeyboardDirectionMixin(KeyboardMixin(ReactiveElement))
          )
        )
      )
    )
  )
);

/**
 * Input with buttons to increase or decrease a value
 *
 * @inherits ReactiveElement
 * @mixes DelegateFocusMixin
 * @mixes DelegateInputLabelMixin
 * @mixes DelegateInputSelectionMixin
 * @mixes DisabledMixin
 * @mixes FocusVisibleMixin
 * @mixes FormElementMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @part {input} input - the text input portion of the spin box
 * @part {button} button - the up and down buttons
 * @part up-button - the up button
 * @part down-button - the down button
 */
export class SpinBox extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      buttonPartType: "button",
      canGoDown: true,
      canGoUp: true,
      inputPartType: "input",
      orientation: "vertical",
      step: 1,
      stepSelect: false,
      value: "",
    });
  }

  [goDown]() {
    if (super[goDown]) {
      super[goDown]();
    }
    this.stepDown();
    return true; // Handled
  }

  [goUp]() {
    if (super[goUp]) {
      super[goUp]();
    }
    this.stepUp();
    return true; // Handled
  }

  get [inputDelegate]() {
    return this[ids].input;
  }

  [render](changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    // Wire up handlers on new buttons.
    if (changed.buttonPartType) {
      this[ids].downButton.addEventListener("mousedown", () => {
        this[raiseChangeEvents] = true;
        this.stepDown();
        this[raiseChangeEvents] = false;
      });
      this[ids].upButton.addEventListener("mousedown", () => {
        this[raiseChangeEvents] = true;
        this.stepUp();
        this[raiseChangeEvents] = false;
      });
    }

    // Wire up event handler on new input.
    if (changed.inputPartType) {
      // Wire up handler on new input.
      this[ids].input.addEventListener("input", () => {
        this.value = /** @type {any} */ (this[ids].input).value;
      });
    }

    // When buttons are clicked, keep focus on input.
    if (changed.buttonPartType || changed.inputPartType) {
      const input = this[ids].input;
      const downButton = this[ids].downButton;
      if (downButton instanceof HTMLElement && input instanceof HTMLElement) {
        forwardFocus(downButton, input);
      }
      const upButton = this[ids].upButton;
      if (upButton instanceof HTMLElement && input instanceof HTMLElement) {
        forwardFocus(upButton, input);
      }
    }

    const { disabled, value } = this[state];

    // When disabled, disable inner elements.
    // Also, disable up or down button if we're at max or min.
    if (changed.canGoUp || changed.canGoDown || changed.disabled) {
      const { canGoUp, canGoDown } = this[state];
      if ("disabled" in this[ids].input) {
        /** @type {any} */ (this[ids].input).disabled = disabled;
      }
      if ("disabled" in this[ids].downButton) {
        const upDisabled = disabled || !canGoUp;
        /** @type {any} */ (this[ids].upButton).disabled = upDisabled;
      }
      if ("disabled" in this[ids].upButton) {
        const downDisabled = disabled || !canGoDown;
        /** @type {any} */ (this[ids].downButton).disabled = downDisabled;
      }
    }

    // Render value state to input.
    if (changed.value) {
      /** @type {any} */ (this[ids].input).value = value;
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    // If we changed the value as a result of stepDown/stepUp, put the cursor
    // at the end of the new text.
    const { stepSelect, value } = this[state];
    if (changed.value && stepSelect) {
      /** @type {any} */ const input = this[ids].input;
      const length = value.length;
      input.selectionStart = length;
      input.selectionEnd = length;
      this[setState]({ stepSelect: false });
    }
  }

  stepDown() {
    // Set selection after we've rendered.
    this[setState]({ stepSelect: true });
  }

  stepUp() {
    // Set selection after we've rendered.
    this[setState]({ stepSelect: true });
  }

  get [template]() {
    const result = super[template];
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          display: inline-grid;
        }

        [part~="input"] {
          grid-row-end: 3;
          grid-row-start: 1;
          outline: none;
          text-align: right;
        }

        [part~="spin-button"] {
          grid-column: 2;
          user-select: none;
        }
      </style>
      <div id="input" part="input"></div>
      <div id="upButton" part="spin-button up-button" tabindex="-1"></div>
      <div id="downButton" part="spin-button down-button" tabindex="-1"></div>
    `);
    return result;
  }

  /**
   * The text entered in the spin box.
   *
   * @type {string}
   * @default ""
   */
  get value() {
    return this[state].value;
  }
  set value(value) {
    this[setState]({
      value: String(value),
    });
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.inputPartType) {
    const { buttonPartType } = state;
    const buttons = root.querySelectorAll('[part~="spin-button"]');
    buttons.forEach((button) => {
      transmute(button, buttonPartType);
    });
  }
  if (!changed || changed.inputPartType) {
    const { inputPartType } = state;
    const input = root.getElementById("input");
    if (input) {
      transmute(input, inputPartType);
    }
  }
}

export default SpinBox;
