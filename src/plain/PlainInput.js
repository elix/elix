import Input from "../base/Input.js";
import PlainInputMixin from "./PlainInputMixin.js";

/**
 * ListBox component in the Plain reference design system
 *
 * @inherits Input
 * @mixes PlainInputMixin
 */
class PlainInput extends PlainInputMixin(Input) {}

export default PlainInput;
