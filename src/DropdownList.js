// import AriaListMixin from './AriaListMixin.js';
// import DirectionSelectionMixin from './DirectionSelectionMixin.js';
// import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
// import KeyboardMixin from './KeyboardMixin.js';
// import KeyboardPagedSelectionMixin from './KeyboardPagedSelectionMixin.js';
// import KeyboardPrefixSelectionMixin from './KeyboardPrefixSelectionMixin.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import PopupMenuButton from './PopupMenuButton.js';
// import SingleSelectionMixin from './SingleSelectionMixin.js';
// import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  // SingleSelectionMixin(
  // SlotItemsMixin(
    PopupMenuButton
  ;


class DropdownList extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.menu.addEventListener('mouseup', event => {
      // TODO: Without this, clicking popup button opens popup then immediately closes it.
      const target = event.target;
      if (target !== this.$.menu) {
        this[symbols.raiseChangeEvents] = true;
        this.value = target.textContent;
        this.close();
        this[symbols.raiseChangeEvents] = false;
      }
    });
    this.$.menu.addEventListener('selected-index-changed', event => {
      this.selectedIndex = event.detail.selectedIndex;
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedIndex: -1
      // selectionRequired: true
    });
  }

  [symbols.keydown](event) {
    let handled;
    switch (event.key) {
      // When open, Enter selects item and closes popup.
      case 'Enter':
        if (this.opened) {
          this.close();
          handled = true;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  get selectedIndex() {
    return this.state.selectedIndex;
  }
  set selectedIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  get updates() {
    const selectedIndex = this.state.selectedIndex;
    return merge(super.updates, {
      $: {
        menu: {
          selectedIndex,
          selectionRequired: true
        },
        valueContainer: {
          textContent: this.value
        }
      }
    });
  }

  get value() {
    return this.$.menu.value;
  }
  set value(value) {
    this.$.menu.value = value;
  }

}


export default DropdownList;
customElements.define('elix-dropdown-list', DropdownList);
