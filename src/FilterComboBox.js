import { merge } from "./updates";
import AutoCompleteInput from "./AutoCompleteInput.js";
import FilterListBox from "./FilterListBox.js";
import ItemsTextMixin from './ItemsTextMixin.js';
import ListComboBox from "./ListComboBox.js";
import * as symbols from './symbols.js';
import SlotItemsMixin from "./SlotItemsMixin";


const Base =
  SlotItemsMixin(
  ItemsTextMixin(
    ListComboBox
  ));


class FilterComboBox extends Base {

  [symbols.beforeUpdate]() {
    const inputRoleChanged = this[symbols.renderedRoles].inputRole !== this.state.inputRole;
    const listRoleChanged = this[symbols.renderedRoles].listRole !== this.state.listRole;
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (inputRoleChanged) {
      this.$.input.addEventListener('input', () => {
        // TODO: raise change events?
        const selectionStart = this.$.input.selectionStart;
        const value = this.$.input.value;
        const selectedInputText = value.slice(0, selectionStart);
        this.setState({
          selectedInputText
        });
      });
    }
    if (listRoleChanged) {
      this.$.list.addEventListener('selected-index-changed', event => {
        /** @type {any} */
        const cast = event;
        const listSelectedIndex = cast.detail.selectedIndex;
        // Translate list index to our index.
        const listSelectedItem = this.$.list.items[listSelectedIndex];
        const selectedIndex = this.items.indexOf(listSelectedItem);
        this.setState({
          selectedIndex
        });
      });
    }
  }
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedInputText: '',
      inputRole: AutoCompleteInput,
      listRole: FilterListBox
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const valueChanged = state.value !== this.state.value;
    const selectedIndexChanged = state.selectedIndex !== this.state.selectedIndex;
    const openedChanged = typeof this.state.opened !== 'undefined' &&
        state.opened !== this.state.opened;
    const selectedItem = state.items && state.items[state.selectedIndex];
    const selectedItemText = selectedItem && selectedItem.textContent;
    if (valueChanged && !selectedIndexChanged && state.selectedIndex >= 0) {
      // Changing the value directly resets the selection.
      state.selectedIndex = -1;
      result = false;
    } else if (openedChanged && !state.opened && 
        selectedItemText && state.value !== selectedItemText) {
      // When user closes combo box, update value and reset selection.
      Object.assign(state, {
        selectedIndex: -1,
        value: selectedItemText
      });
      result = false;
    }
    return result;
  }

  get updates() {
    const filter = this.state.selectedInputText || this.state.value;
    return merge(super.updates, {
      $: {
        input: Object.assign(
          {},
          'texts' in this.$.input && {
            texts: this.state.texts
          }
        ),
        list: {
          filter
        }
      }
    });
  }

}


export default FilterComboBox;
customElements.define('elix-filter-combo-box', FilterComboBox);
