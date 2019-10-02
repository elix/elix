import AriaRoleMixin from '../../src/AriaRoleMixin.js';
import DirectionSelectionMixin from '../../src/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../../src/KeyboardDirectionMixin.js';
import KeyboardMixin from '../../src/KeyboardMixin.js';
import Modes from '../../src/Modes.js';

const ModesWithKeyboard = AriaRoleMixin(
  DirectionSelectionMixin(KeyboardDirectionMixin(KeyboardMixin(Modes)))
);

customElements.define('modes-with-keyboard', ModesWithKeyboard);
export default ModesWithKeyboard;
