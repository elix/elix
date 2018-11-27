import { merge } from "./updates";
import AutoCompleteInput from "./AutoCompleteInput.js";
import ListComboBox from "./ListComboBox.js";


class AutoCompleteComboBox extends ListComboBox {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      inputRole: AutoCompleteInput
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const selectedIndexChanged = state.selectedIndex >= 0 &&
      state.selectedIndex !== this.state.selectedIndex;
    if (state.items && selectedIndexChanged) {
      // List selection changed, update and select the value.
      const selectedItem = state.items[state.selectedIndex];
      const selectedItemText = selectedItem && selectedItem.textContent;
      if (state.value !== selectedItemText) {
        Object.assign(state, {
          selectText: true,
          value: selectedItemText
        });
        result = false;
      }
    }
    return result;
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
