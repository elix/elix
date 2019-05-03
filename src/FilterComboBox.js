import { getTextsFromItems } from './ItemsTextMixin.js';
import { merge } from './updates.js';
import { substantiveElement } from './content.js';
import * as symbols from './symbols.js';
import AutoCompleteInput from './AutoCompleteInput.js';
import FilterListBox from './FilterListBox.js';
import ListComboBox from './ListComboBox.js';
import SlotContentMixin from './SlotContentMixin.js';


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
          cast.detail.originalText :
          this.state.value;
        this.setState({
          filter
        });
        this[symbols.raiseChangeEvents] = false;
      });
    }
  }
  
  get defaultState() {
    const state = Object.assign(super.defaultState, {
      filter: '',
      inputRole: AutoCompleteInput,
      listRole: FilterListBox,
      texts: null
    });

    // If content changes, regenerate texts.
    state.onChange('content', state => {
      const { content } = state;
      const items = content ?
        content.filter(element => substantiveElement(element)) :
        null;
      const texts = items ?
        getTextsFromItems(items) :
        [];
      return {
        texts
      };
    });

    // Closing resets the filter.
    state.onChange('opened', state => {
      if (!state.opened) {
        return {
          filter: ''
        };
      }
      return null;
    });

    return state;
  }

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.filter || changed.selectedIndex) {
      const { filter, selectedIndex } = state;
      if (filter === '' || selectedIndex === -1) {
        this.$.list.filter = filter;
      }
    }
    if (changed.texts) {
      if ('texts' in this.$.input) {
        this.$.input.texts = state.texts;
      }
    }
  }

}


export default FilterComboBox;
customElements.define('elix-filter-combo-box', FilterComboBox);
