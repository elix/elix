import AriaRoleMixin from "../../src/base/AriaRoleMixin.js";
import DirectionCursorMixin from "../../src/base/DirectionCursorMixin.js";
import KeyboardDirectionMixin from "../../src/base/KeyboardDirectionMixin.js";
import KeyboardMixin from "../../src/base/KeyboardMixin.js";
import Modes from "../../src/base/Modes.js";

const ModesWithKeyboard = AriaRoleMixin(
  DirectionCursorMixin(KeyboardDirectionMixin(KeyboardMixin(Modes)))
);

customElements.define("modes-with-keyboard", ModesWithKeyboard);
export default ModesWithKeyboard;
