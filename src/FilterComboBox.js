import { getTextsFromItems } from './ItemsTextMixin.js';
import { isSubstantiveElement } from './content.js';
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
        content.filter(element => isSubstantiveElement(element)) :
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

  [symbols.populate](state, changed) {
    super[symbols.populate](state, changed);
    if (changed.inputRole) {
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

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.filter || changed.selectedIndex) {
      const { filter, selectedIndex } = state;
      if (filter === '' || selectedIndex === -1) {
        const list = /** @type {any} */ (this.$.list);
        if ('filter' in list) {
          list.filter = filter;
        }
      }
    }
    if (changed.texts) {
      const input = /** @type {any} */ (this.$.input);
      if ('texts' in input) {
        input.texts = state.texts;
      }
    }
  }

}


export default FilterComboBox;
customElements.define('elix-filter-combo-box', FilterComboBox);
