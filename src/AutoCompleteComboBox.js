import * as symbols from './symbols.js';
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

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], {
      inputRole: AutoCompleteInput
    });
  }

  [symbols.render](/** @type {PlainObject} */ changed) {
    super[symbols.render](changed);
    if (changed.texts) {
      if ('texts' in this.$.input) {
        /** @type {any} */ (this.$.input).texts = this[symbols.state].texts;
      }
    }
  }

}


export default AutoCompleteComboBox;
customElements.define('elix-auto-complete-combo-box', AutoCompleteComboBox);
