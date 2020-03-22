import Button from "./Button.js";
import RepeatMousedownMixin from "./RepeatMousedownMixin.js";

/**
 * A button that raises mousedown events as long as the mouse is down
 *
 * @inherits Button
 * @mixes RepeatMousedownMixin
 */
class RepeatButton extends RepeatMousedownMixin(Button) {}

export default RepeatButton;
