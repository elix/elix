import Button from "./Button.js";
import SelectableMixin from "./SelectableMixin.js";

const Base = SelectableMixin(Button);

/**
 * A button that tracks a selection state
 *
 * @inherits Button
 * @mixes SelectableMixin
 */
class SelectableButton extends Base {}

export default SelectableButton;
