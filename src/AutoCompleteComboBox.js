import * as internal from './internal.js';
import AutoCompleteInput from './AutoCompleteInput.js';
import ListComboBox from './ListComboBox.js';
import ItemsTextMixin from './ItemsTextMixin.js';


const Base = 
  ItemsTextMixin(
    ListComboBox
  );


/**
 * A combo box that auto-completes the user's input against the list items
 * 
 * @inherits ListComboBox
 * @mixes ItemsTextMixin
 * @elementrole {AutoCompleteInput} input
 */
class AutoCompleteComboBox extends Base {

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      inputRole: AutoCompleteInput
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.texts) {
      if ('texts' in this[internal.$].input) {
        /** @type {any} */ (this[internal.$].input).texts = this[internal.state].texts;
      }
    }
  }

}


export default AutoCompleteComboBox;
customElements.define('elix-auto-complete-combo-box', AutoCompleteComboBox);
