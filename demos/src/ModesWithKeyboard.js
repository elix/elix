import DirectionSelectionMixin from '../../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../../mixins/KeyboardMixin.js';
import Modes from '../../elements/Modes.js';
import SelectionAriaMixin from '../../mixins/SelectionAriaMixin.js';


const mixins = [
  DirectionSelectionMixin,
  KeyboardDirectionMixin,
  KeyboardMixin,
  SelectionAriaMixin
];


const ModesWithKeyboard = mixins.reduce((cls, mixin) => mixin(cls), Modes);

customElements.define('modes-with-keyboard', ModesWithKeyboard);
export default ModesWithKeyboard;
