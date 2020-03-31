import RepeatButton from "../base/RepeatButton.js";
import PlainButtonMixin from "./PlainButtonMixin.js";

/**
 * Button component in the Plain reference design system
 *
 * @inherits RepeatButton
 * @mixes PlainButtonMixin
 */
class PlainRepeatButton extends PlainButtonMixin(RepeatButton) {}

export default PlainRepeatButton;
