import AriaRoleMixin from "../../src/base/AriaRoleMixin.js";
import DirectionSelectionMixin from "../../src/base/DirectionSelectionMixin.js";
import KeyboardDirectionMixin from "../../src/base/KeyboardDirectionMixin.js";
import KeyboardMixin from "../../src/base/KeyboardMixin.js";
import Modes from "../../src/base/Modes.js";

const ModesWithKeyboard = AriaRoleMixin(
  DirectionSelectionMixin(KeyboardDirectionMixin(KeyboardMixin(Modes)))
);

customElements.define("modes-with-keyboard", ModesWithKeyboard);
export default ModesWithKeyboard;
