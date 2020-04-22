import * as internal from "../../src/base/internal.js";
import PlainSpinBox from "../../src/plain/PlainSpinBox.js";

const romanToNumberMap = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
};

export default class RomanSpinBox extends PlainSpinBox {
  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects];

    if (changed.value) {
      const { value } = state;
      Object.assign(effects, {
        canGoDown: value !== "I" && value !== "",
      });
    }

    return effects;
  }

  stepDown() {
    super.stepDown();
    const number = romanToNumber(this.value);
    this.value = numberToRoman(number - 1);
  }

  stepUp() {
    super.stepUp();
    const number = romanToNumber(this.value);
    this.value = numberToRoman(number + 1);
  }
}

function numberToRoman(n) {
  if (n < 1) {
    return "";
  }
  let roman = "";
  for (let i in romanToNumberMap) {
    while (n >= romanToNumberMap[i]) {
      roman += i;
      n -= romanToNumberMap[i];
    }
  }
  return roman;
}

function romanToNumber(roman) {
  let n = 0;
  for (let i = 0; i < roman.length; i++) {
    const currentRoman = roman[i];
    const currentNumber = romanToNumberMap[currentRoman];
    const nextRoman = roman[i + 1];
    const nextNumber = romanToNumberMap[nextRoman];
    if (currentNumber < nextNumber) {
      n -= currentNumber;
    } else {
      n += currentNumber;
    }
  }
  return n;
}

customElements.define("roman-spin-box", RomanSpinBox);
