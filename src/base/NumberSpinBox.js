import * as internal from "./internal.js";
import SpinBox from "./SpinBox.js";

/**
 * Input with buttons to increase or decrease a numeric value
 *
 * @inherits SpinBox
 */
class NumberSpinBox extends SpinBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      max: null,
      min: null,
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
   * @param {number} precision
   */
  formatValue(value, precision) {
    return Number(value).toFixed(precision);
  }

  /**
   * The maximum allowable value of the `value` property.
   *
   * @type {number|null}
   * @default 1
   */
  get max() {
    return this[internal.state].max;
  }
  set max(max) {
    const parsed = typeof max === "string" ? parseFloat(max) : max;
    this[internal.setState]({ max: parsed });
  }

  /**
   * The minimum allowable value of the `value` property.
   *
   * @type {number|null}
   * @default 1
   */
  get min() {
    return this[internal.state].min;
  }
  set min(min) {
    const parsed = typeof min === "string" ? parseFloat(min) : min;
    this[internal.setState]({ min: parsed });
  }

  /**
   * Parse the given string as a number.
   *
   * This is used to parse the current value before incrementing/decrementing
   * it.
   *
   * @param {string} value
   * @param {number} precision
   */
  parseValue(value, precision) {
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

    if (changed.max || changed.min || changed.value) {
      // The value is valid if it falls between the min and max.
      // TODO: We need a way to let other classes/mixins on the prototype chain
      // contribute to validity -- if someone else thinks the value is invalid,
      // we should respect that, even if the value falls within the min/max
      // bounds.
      const { max, min, precision, value } = state;
      const parsed = parseInt(value, precision);
      if (value !== "" && isNaN(parsed)) {
        Object.assign(effects, {
          valid: false,
          validationMessage: "Value must be a number"
        });
      } else if (!(max === null || parsed <= max)) {
        Object.assign(effects, {
          valid: false,
          validationMessage: `Value must be less than or equal to ${max}.`
        });
      } else if (!(min === null || parsed >= min)) {
        Object.assign(effects, {
          valid: false,
          validationMessage: `Value must be greater than or equal to ${min}.`
        });
      } else {
        Object.assign(effects, {
          valid: true,
          validationMessage: ""
        });
      }

      // We can only go up if we're below max.
      Object.assign(effects, {
        canGoUp: isNaN(parsed) || state.max === null || parsed < state.max
      });

      // We can only go down if we're above min.
      Object.assign(effects, {
        canGoDown: isNaN(parsed) || state.min === null || parsed > state.min
      });
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
   *
   * If the result is still greater than the `max` value, this will force
   * `value` to `max`.
   */
  stepDown() {
    super.stepDown();
    const { max, precision, value } = this[internal.state];
    let result = this.parseValue(value, precision) - this.step;
    if (max !== null) {
      result = Math.min(result, max);
    }
    const { min } = this[internal.state];
    if (min === null || result >= min) {
      this.value = this.formatValue(result, precision);
    }
  }

  /**
   * Increments the `value` by the amount of the `step`.
   *
   * If the result is still smaller than the `min` value, this will force
   * `value` to `min`.
   */
  stepUp() {
    super.stepUp();
    const { min, precision, value } = this[internal.state];
    let result = this.parseValue(value, precision) + this.step;
    if (min !== null) {
      result = Math.max(result, min);
    }
    const { max } = this[internal.state];
    if (max === null || result <= max) {
      this.value = this.formatValue(result, precision);
    }
  }
}

export default NumberSpinBox;
