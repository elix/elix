import { merge } from "./updates.js";
import AutoCompleteInput from "./AutoCompleteInput.js";
import ListComboBox from "./ListComboBox.js";
import ItemsTextMixin from "./ItemsTextMixin.js";


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

  get defaultState() {
    return Object.assign(super.defaultState, {
      inputRole: AutoCompleteInput
    });
  }

  get updates() {
    return merge(super.updates, {
      $: {
        input: Object.assign(
          {},
          'texts' in this.$.input && {
            texts: this.state.texts
          }
        )
      }
    });
  }

}


export default AutoCompleteComboBox;
customElements.define('elix-auto-complete-combo-box', AutoCompleteComboBox);
