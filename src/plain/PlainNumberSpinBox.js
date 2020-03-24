import NumberSpinBox from "../base/NumberSpinBox.js";
import PlainSpinBoxMixin from "./PlainSpinBoxMixin.js";

export default class PlainNumberSpinBox extends PlainSpinBoxMixin(
  NumberSpinBox
) {}

customElements.define("plain-number-spin-box", PlainNumberSpinBox);
