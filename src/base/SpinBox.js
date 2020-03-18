import * as internal from "../core/internal.js";
import * as template from "../core/template.js";
import FormElementMixin from "../base/FormElementMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";

/**
 * Input element with buttons to increase or decrease the value
 *
 * @part {input} input - the text input portion of the spin box
 * @part {button} button - the up and down buttons
 * @part up-button - the up button
 * @part down-button - the down button
 */
export class SpinBox extends FormElementMixin(ReactiveElement) {
  get [internal.defaultState]() {
    return {
      ...super[internal.defaultState],
      buttonPartType: "button",
      inputPartType: "input",
      step: 1,
      value: 0
    };
  }

  /**
   * Format the numeric value as a string.
   *
   * This is used after incrementing/decrementing the value to reformat the
   * value as a string.
   *
   * @param {number} value
   */
  formatValue(value) {
    return String(value);
  }

  /**
   * Parse the given string as a number.
   *
   * This is used to parse the current value before incrementing/decrementing
   * it.
   *
   * @param {string} value
   */
  parseValue(value) {
    return parseInt(value);
  }

  [internal.render](changed) {
    super[internal.render](changed);

    renderParts(this[internal.shadowRoot], this[internal.state], changed);

    if (this[internal.firstRender]) {
      // Add Up key and Down key handlers.
      this.addEventListener("keydown", event => {
        this[internal.raiseChangeEvents] = true;
        let handled = false;
        switch (event.key) {
          case "ArrowDown":
            this.stepDown();
            handled = true;
            break;

          case "ArrowUp":
            this.stepUp();
            handled = true;
            break;
        }
        if (handled) {
          event.preventDefault();
        }
        this[internal.raiseChangeEvents] = false;
      });
    }

    // Wire up handlers on new buttons.
    if (changed.buttonPartType) {
      this[internal.ids].downButton.addEventListener("mousedown", () => {
        this.stepDown();
      });
      this[internal.ids].upButton.addEventListener("mousedown", () => {
        this.stepUp();
      });
    }

    // Wire up event handler on new input.
    if (changed.inputPartType) {
      // Wire up handler on new input.
      this[internal.ids].input.addEventListener("input", () => {
        this.value = /** @type {any} */ (this[internal.ids].input).value;
      });
    }

    // Render value state to input.
    if (changed.value) {
      const { value } = this[internal.state];
      /** @type {any} */ (this[internal.ids].input).value = value;
    }
  }

  /**
   * The amount by which the value will be incremented or decremented.
   *
   * @type {number}
   * @default 1
   */
  get step() {
    return this[internal.state].step;
  }
  set step(step) {
    this[internal.setState]({ step });
  }

  /**
   * Decrements the `value` by the amount of the `step`.
   */
  stepDown() {
    this.value = this.formatValue(this.parseValue(this.value) - this.step);
  }

  /**
   * Increments the `value` by the amount of the `step`.
   */
  stepUp() {
    this.value = this.formatValue(this.parseValue(this.value) + this.step);
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: inline-grid;
        }

        [part~="input"] {
          grid-row-end: 3;
          grid-row-start: 1;
          text-align: right;
        }

        [part~="spin-button"] {
          grid-column: 2;
          user-select: none;
        }
      </style>
      <div id="input" part="input"></div>
      <div id="upButton" part="spin-button up-button"></div>
      <div id="downButton" part="spin-button down-button"></div>
    `;
  }

  /**
   * The value entered in the spin box.
   *
   * @type {string}
   * @default "0"
   */
  get value() {
    return this[internal.state].value;
  }
  set value(value) {
    this[internal.setState]({ value });
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
    buttons.forEach(button => {
      template.transmute(button, buttonPartType);
    });
  }
  if (!changed || changed.inputPartType) {
    const { inputPartType } = state;
    const input = root.getElementById("input");
    if (input) {
      template.transmute(input, inputPartType);
    }
  }
}

export default SpinBox;
