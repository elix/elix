import DirectionSelectionMixin from '../../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../../mixins/KeyboardMixin.js';
import Modes from '../../elements/Modes.js';
import SelectionAriaMixin from '../../mixins/SelectionAriaMixin.js';


const ModesWithKeyboard =
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  SelectionAriaMixin(
    Modes
  ))));

customElements.define('modes-with-keyboard', ModesWithKeyboard);
export default ModesWithKeyboard;
