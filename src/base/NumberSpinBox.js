import * as internal from "./internal.js";
import SpinBox from "./SpinBox.js";

class NumberSpinBox extends SpinBox {
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
