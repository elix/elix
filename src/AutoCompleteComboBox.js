import { merge } from "./updates";
import AutoCompleteInput from "./AutoCompleteInput";
import ListComboBox from "./ListComboBox";


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
    const valueChanged = state.value !== this.state.value;
    if (state.items && selectedIndexChanged) {
      // List selection changed, update value.
      const selectedItem = state.items[state.selectedIndex];
      const selectedItemText = selectedItem && selectedItem.textContent;
      if (state.value !== selectedItemText) {
        Object.assign(state, {
          selectText: true,
          value: selectedItemText
        });
        result = false;
      }
    } else if (state.texts && valueChanged) {
      // Value changed, select that value in list (if it exists).
      const searchText = state.value.toLowerCase();
      const selectedIndex = this.state.texts.findIndex(text => 
        text.toLowerCase() === searchText
      );
      if (state.selectedIndex !== selectedIndex) {
        Object.assign(state, {
          selectedIndex
        });
        result = false;
      }
      if (state.selectText) {
        // User probably changed value directly, so stop trying to select
        // text.
        Object.assign(state, {
          selectText: false
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
          this.state.selectText && {
            selectionEnd: this.state.value.length,
            selectionStart: 0
          },
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
