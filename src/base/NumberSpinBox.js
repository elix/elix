import * as internal from "./internal.js";
import SpinBox from "./SpinBox.js";

class NumberSpinBox extends SpinBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      step: 1
    });
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
    const { precision } = this[internal.state];
    return Number(value).toFixed(precision);
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
    const { precision } = this[internal.state];
    const parsed = precision === 0 ? parseInt(value) : parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects];

    // If step changed, calculate its precision (number of digits after
    // the decimal).
    if (changed.step) {
      const { step } = state;
      const decimalRegex = /\.(\d)+$/;
      const match = decimalRegex.exec(String(step));
      const precision = match && match[1] ? match[1].length : 0;
      Object.assign(effects, { precision });
    }

    return effects;
  }

  /**
   * The amount by which the `value` will be incremented or decremented.
   *
   * The precision of the step (the number of digits after any decimal)
   * determines how the spin box will format the number. The default `step`
   * value of 1 has no decimals, so the `value` will be formatted as an integer.
   * A `step` of 0.1 will format the `value` as a number with one decimal place.
   *
   * @type {number}
   * @default 1
   */
  get step() {
    return this[internal.state].step;
  }
  set step(step) {
    const parsed = typeof step === "string" ? parseFloat(step) : step;
    this[internal.setState]({ step: parsed });
  }

  /**
   * Decrements the `value` by the amount of the `step`.
   */
  stepDown() {
    super.stepDown();
    this.value = this.formatValue(this.parseValue(this.value) - this.step);
  }

  /**
   * Increments the `value` by the amount of the `step`.
   */
  stepUp() {
    super.stepUp();
    this.value = this.formatValue(this.parseValue(this.value) + this.step);
  }
}

export default NumberSpinBox;
