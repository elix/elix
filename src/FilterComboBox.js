import { getTextsFromItems } from './ItemsTextMixin.js';
import { merge } from "./updates.js";
import { substantiveElement } from './content.js';
import * as symbols from './symbols.js';
import AutoCompleteInput from "./AutoCompleteInput.js";
import FilterListBox from "./FilterListBox.js";
import ListComboBox from "./ListComboBox.js";
import SlotContentMixin from './SlotContentMixin.js';


const previousStateKey = Symbol('previousState');


const Base =
  SlotContentMixin(
    ListComboBox
  );


/**
 * A combo box which applies its text input as a filter on its list items
 * 
 * @inherits ListComboBox
 * @mixes SlotContentMixin
 * @elementrole {AutoCompleteInput} input
 * @elementrole {FilterListBox} list
 */
class FilterComboBox extends Base {

  [symbols.beforeUpdate]() {
    const inputRoleChanged = this[symbols.renderedRoles].inputRole !== this.state.inputRole;
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (inputRoleChanged) {
      this.$.input.addEventListener('input', event => {
        this[symbols.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        const filter = cast.detail ?
          cast.detail.originalInput :
          this.state.value;
        this.setState({
          filter
        });
        this[symbols.raiseChangeEvents] = false;
      });
    }
  }
  
  get defaultState() {
    return Object.assign(super.defaultState, {
      filter: '',
      inputRole: AutoCompleteInput,
      listRole: FilterListBox,
      texts: null
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      content: null,
      filter: null,
      opened: false
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const { content, filter, opened } = state;
    if (changed.content) {
      const items = content.filter(element => substantiveElement(element));
      const texts = getTextsFromItems(items);
      state.texts = texts;
      result = false;
    }
    const closing = changed.opened && !opened;
    if (closing && filter) {
      // Closing resets the filter.
      state.filter = '';
      result = false;
    }

    return result;
  }

  get updates() {
    const { filter, selectedIndex } = this.state;
    const applyFilter = filter === '' || selectedIndex === -1;
    return merge(super.updates, {
      $: {
        input: Object.assign(
          {},
          'texts' in this.$.input && {
            texts: this.state.texts
          }
        ),
        list: Object.assign(
          {},
          applyFilter && {
            filter
          }
        )
      }
    });
  }

}


export default FilterComboBox;
customElements.define('elix-filter-combo-box', FilterComboBox);
