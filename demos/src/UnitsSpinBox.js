import PlainSpinBox from "../../src/plain/PlainSpinBox.js";

export default class UnitsSpinBox extends PlainSpinBox {
  stepDown() {
    super.stepDown();
    const { number, unit } = parse(this.value);
    this.value = format(number - 1, unit);
  }

  stepUp() {
    super.stepUp();
    const { number, unit } = parse(this.value);
    this.value = format(number + 1, unit);
  }
}

function format(number, unit) {
  return unit ? `${number}${unit}` : number;
}

function parse(s) {
  const numberWithUnitRegex = /(-?\d+)(?:\s*(.+))?/;
  const match = numberWithUnitRegex.exec(s);
  const parsed = parseInt(s);
  const number = match ? parseInt(match[1]) : isNaN(parsed) ? 0 : parsed;
  const unit = match ? match[2] : "";
  return { number, unit };
}

customElements.define("units-spin-box", UnitsSpinBox);
