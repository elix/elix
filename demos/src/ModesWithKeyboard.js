import DirectionSelectionMixin from '../../mixins/DirectionSelectionMixin';
import KeyboardDirectionMixin from '../../mixins/KeyboardDirectionMixin';
import KeyboardMixin from '../../mixins/KeyboardMixin';
import Modes from '../../elements/Modes';
import SelectionAriaMixin from '../../mixins/SelectionAriaMixin';


const mixins = [
  DirectionSelectionMixin,
  KeyboardDirectionMixin,
  KeyboardMixin,
  SelectionAriaMixin
];


const ModesWithKeyboard = mixins.reduce((cls, mixin) => mixin(cls), Modes);

customElements.define('modes-with-keyboard', ModesWithKeyboard);
export default ModesWithKeyboard;
