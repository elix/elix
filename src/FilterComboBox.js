import { merge } from "./updates";
import FilterListBox from "./FilterListBox";
import ListComboBox from "./ListComboBox";


class FilterComboBox extends ListComboBox {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listRole: FilterListBox
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const openedChanged = typeof this.state.opened !== 'undefined' &&
        state.opened !== this.state.opened;
    const selectedItem = state.items && state.items[state.selectedIndex];
    const selectedItemText = selectedItem && selectedItem.textContent;
    if (openedChanged) {
      if (state.opened) {
        // 
      } else if (!state.opened && 
        selectedItemText && state.value !== selectedItemText) {
        // When user closes combo box, update value and reset selection.
        Object.assign(state, {
          selectedIndex: -1,
          selectText: true,
          value: selectedItemText
        });
        result = false;
      }
    }

    return result;
  }

  get updates() {
    const filter = this.state.value;
    return merge(super.updates, {
      $: {
        list: {
          filter
        }
      }
    });
  }

}


export default FilterComboBox;
customElements.define('elix-filter-combo-box', FilterComboBox);
