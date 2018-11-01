import './AutoCompleteInput.js';
import './ListBox.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ComboBox from './ComboBox.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import ItemsTextMixin from './ItemsTextMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';
import AutoCompleteInput from './AutoCompleteInput.js';


const Base =
  DirectionSelectionMixin(
  ItemsTextMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    ComboBox
  ))));


// TODO: Remaining roles
/**
 * @elementrole {AutoCompleteInput} input
 */
class ListComboBox extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // Track changes in the list's selection state.
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

    this.$.list.addEventListener('click', () => {
      // Clicking a list item closes the popup.
      if (this.opened) {
        this[symbols.raiseChangeEvents] = true;
        this.close();
        this[symbols.raiseChangeEvents] = false;
      }
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      inputRole: AutoCompleteInput
    });
  }

  // We do our own handling of the Up and Down arrow keys, rather than relying
  // on KeyboardDirectionMixin. The latter supports Home and End, and we don't
  // want to handle those -- we want to let the text input handle them.
  [symbols.keydown](event) {
    let handled;

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

    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;

    const selectedIndexChanged = state.selectedIndex >= 0 &&
      state.selectedIndex !== this.state.selectedIndex;
    const valueChanged = state.value !== this.state.value;
    if (selectedIndexChanged || valueChanged) {
      const items = this.itemsForState(state);
      if (items) {
        if (selectedIndexChanged) {
          const selectedItem = items[state.selectedIndex];
          const selectedItemText = selectedItem && selectedItem.textContent;
          if (state.value !== selectedItemText) {
            Object.assign(state, {
              value: selectedItemText
            });
            result = false;
          }
        } else if (valueChanged) {
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
        }          
      }
    }

    return result;
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
        }
      </style>
      <elix-list-box id="list" tabindex="-1">
        <slot></slot>
      </elix-list-box>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, listTemplate);
    }

    return result;
  }

  get updates() {
    return merge(
      super.updates,
      {
        $: {
          list: {
            selectedIndex: this.state.selectedIndex
          }
        }
      },
      'texts' in this.$.input && {
        $: {
          input: {
            texts: this.state.texts
          }
        }
      }
    );
  }

}


export default ListComboBox;
customElements.define('elix-list-combo-box', ListComboBox);
