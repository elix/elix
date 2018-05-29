// import AriaListMixin from './AriaListMixin.js';
// import DirectionSelectionMixin from './DirectionSelectionMixin.js';
// import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
// import KeyboardMixin from './KeyboardMixin.js';
// import KeyboardPagedSelectionMixin from './KeyboardPagedSelectionMixin.js';
// import KeyboardPrefixSelectionMixin from './KeyboardPrefixSelectionMixin.js';
import PopupMenuButton from './PopupMenuButton.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';
import { merge } from './updates.js';


const Base =
  SelectedItemTextValueMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    PopupMenuButton
  )));


class DropdownList extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.popup.addEventListener('focus', event => {
      if (event.relatedTarget === this.$.menu) {
        // User pressed Shift+Tab from menu.
        this.close();
      } else {
        this.$.menu.focus();
      }
    });
  }
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  get updates() {
    return merge(super.updates, {
      $: {
        valueContainer: {
          textContent: this.value
        }
      }
    });
  }

}


export default DropdownList;
customElements.define('elix-dropdown-list', DropdownList);
