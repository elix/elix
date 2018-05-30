import AriaListMixin from './AriaListMixin.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import PopupMenuButton from './PopupMenuButton.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  AriaListMixin(
  SelectedItemTextValueMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    PopupMenuButton
  ))));


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
      this.setState({
        menuSelectedIndex: event.detail.selectedIndex
      });
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      menuSelectedIndex: -1,
      selectionRequired: true
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

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const { menuSelectedIndex, selectedIndex } = state;
    if (state.opened && !this.opened && menuSelectedIndex !== selectedIndex) {
      // Opening: Copy our selection to menu selection.
      state.menuSelectedIndex = selectedIndex;
      result = false;
    } else if (!state.opened && this.opened && selectedIndex !== menuSelectedIndex) {
      // Closing: Update our selection from menu selection.
      state.selectedIndex = menuSelectedIndex;
      result = false;
    }
    return result;
  }

  get updates() {
    const base = super.updates;
    const outline = base && base.style && base.style.outline;
    return merge(base, {
      $: {
        menu: {
          style: {
            outline
          },
          selectedIndex: this.state.menuSelectedIndex
        },
        valueContainer: {
          textContent: this.value
        }
      }
    });
  }

}


export default DropdownList;
customElements.define('elix-dropdown-list', DropdownList);
