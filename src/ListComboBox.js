import './ListBox.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ComboBox from './ComboBox.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    ComboBox
  ))));


// TODO: Roles
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

  [symbols.keydown](event) {
    let handled;

    switch (event.key) {
      // Up/Down arrow keys open the popup.
      // ComboBox also handles these keys, but we need to redefine them here so
      // that they can take priority over KeyboardDirectionMixin.
      case 'ArrowDown':
      case 'ArrowUp':
        if (this.closed) {
          this.open();
          handled = true;
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
          const texts = getTextsForItems(this, items);
          const indexOfValue = texts.indexOf(state.value.toLowerCase());
          if (state.selectedIndex !== indexOfValue) {
            Object.assign(state, {
              selectedIndex: indexOfValue
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
    return merge(super.updates, {
      $: {
        list: {
          selectedIndex: this.state.selectedIndex
        }
      }
    });
  }

}


// TODO: Share with KeyboardPrefixSelectionMixin
// Return an array of the text content (in lowercase) of all items.
function getTextsForItems(element, items) {
  const texts = Array.prototype.map.call(items, item => {
    // const text = element[symbols.getItemText](item);
    const text = item.textContent;
    return text.toLowerCase();
  });
  return texts;
}


export default ListComboBox;
customElements.define('elix-list-combo-box', ListComboBox);
