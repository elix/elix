import PlainSpinBoxMixin from "./PlainSpinBoxMixin.js";
import SpinBox from "../base/SpinBox.js";

export default class PlainSpinBox extends PlainSpinBoxMixin(SpinBox) {}

customElements.define("plain-number-spin-box", PlainSpinBox);
