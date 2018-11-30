import { getItemText } from './ItemsTextMixin.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import { stateChanged } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ComboBox from './ComboBox.js';
import DelegateItemsMixin from "./DelegateItemsMixin";
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import ListBox from './ListBox.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';


const previousStateKey = Symbol('previousState');


const Base =
  DelegateItemsMixin(
  DirectionSelectionMixin(
  SingleSelectionMixin(
    ComboBox
  )));


/**
 * A combo box whose popup presents a list of choices
 * 
 * @inherits ComboBox
 * @mixes DelegateItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes SingleSelectionMixin
 * @elementRole {ListBox} list
 */
class ListComboBox extends Base {

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].listRole !== this.state.listRole) {
      template.transmute(this.$.list, this.state.listRole);
  
      this.$.list.addEventListener('click', () => {
        // Clicking a list item closes the popup.
        if (this.opened) {
          this[symbols.raiseChangeEvents] = true;
          this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      });

      this.$.list.addEventListener('mousedown', event => {
        // By default the list will try to grab focus, which we don't want.
        event.preventDefault();
      });

      // Track changes in the list's selection state.
      // Known bug: this behavior seems to confuse Gboard on Chrome for Android.
      // If we update our notion of the selection index, we'll ultimately update
      // the text shown in the input and leave it selected. If the user then
      // presses Backspace to delete that selected text, Gboard/Chrome seems to
      // ignore the first press of the Backspace key. The user must press
      // Backspace a second time to actually delete the selected text.
      this.$.list.addEventListener('selected-index-changed', event => {
        /** @type {any} */
        const cast = event;
        const listSelectedIndex = cast.detail.selectedIndex;
        if (this.state.selectedIndex !== listSelectedIndex) {
          this.setState({
            selectedIndex: listSelectedIndex
          });
        }
      });

      this[symbols.renderedRoles].listRole = this.state.listRole;
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listRole: ListBox,
      selectedIndex: -1
    });
  }

  // We do our own handling of the Up and Down arrow keys, rather than relying
  // on KeyboardDirectionMixin. The latter supports Home and End, and we don't
  // want to handle those -- we want to let the text input handle them.
  // We also need to forward PageDown/PageUp to the list element.
  [symbols.keydown](event) {

    let handled;
    /** @type {any} */
    const list = this.$.list;

    switch (event.key) {

      case 'ArrowDown':
        if (this.opened) {
          handled = event.altKey ? this[symbols.goEnd]() : this[symbols.goDown]();
        }
        break;

      case 'ArrowUp':
        if (this.opened) {
          handled = event.altKey ? this[symbols.goStart]() : this[symbols.goUp]();
        }
        break;

      case 'PageDown':
        handled = list.pageDown && list.pageDown();
        break;
        
      case 'PageUp':
        handled = list.pageUp && list.pageUp();
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  /**
   * The class, tag, or template used to create the list element.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default ListBox
   */
  get listRole() {
    return this.state.listRole;
  }
  set listRole(listRole) {
    this.setState({ listRole });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      items: null,
      opened: null,
      selectedIndex: null,
      value: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const { items, opened, selectedIndex, value } = state;
    const closing = changed.opened && !opened;
    if (items && value != null && (changed.value || changed.items)) {
      // If value was changed directly, or items have updated, select the
      // coresponding item in list.
      const searchText = value.toLowerCase();
      const itemIndex = items.findIndex(item => {
        const itemText = getItemText(item);
        return itemText.toLowerCase() === searchText
      });
      if (selectedIndex !== itemIndex) {
        state.selectedIndex = itemIndex;
        result = false;
      }
    } else if (selectedIndex >= 0 && (changed.selectedIndex || closing)) {
      // If user selects new item, or combo is closing, make selected item the
      // value.
      const selectedItem = items[selectedIndex];
      if (selectedItem) {
        const selectedItemText = getItemText(selectedItem);
        if (value !== selectedItemText) {
          state.selectText = true;
          state.value = selectedItemText;
          result = false;
        }
      }
    }
    if (changed.items && state.popupMeasured) {
      // When items change, we need to recalculate popup size.
      state.popupMeasured = false;
      result = false;
    }
    return result;
  }

  get [symbols.itemsDelegate]() {
    return this.$.list;
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, ListComboBox, symbols.template);

    // Wrap default slot with a list.
    const listTemplate = template.html`
      <style>
        #list {
          border: none;
          flex: 1;
          width: 100%;
        }
      </style>
      <div id="list" tabindex="-1">
        <slot></slot>
      </div>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, listTemplate);
    }

    return result;
  }

  get updates() {
    return merge(super.updates, {
      attributes: {
        'aria-haspopup': 'listbox'
      },
      $: {
        input: {
          attributes: {
            'aria-autocomplete': 'both'
          }
        },
        list: {
          attributes: {
            tabindex: null
          },
          selectedIndex: this.state.selectedIndex
        }
      }
    });
  }

}


export default ListComboBox;
customElements.define('elix-list-combo-box', ListComboBox);
