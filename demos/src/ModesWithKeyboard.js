import AriaListMixin from '../../mixins/AriaListMixin.js';
import DirectionSelectionMixin from '../../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../../mixins/KeyboardMixin.js';
import Modes from '../../elements/Modes.js';


const ModesWithKeyboard =
  AriaListMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
    Modes
  ))));

customElements.define('modes-with-keyboard', ModesWithKeyboard);
export default ModesWithKeyboard;
