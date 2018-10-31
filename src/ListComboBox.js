import './ListBox.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ComboBox from './ComboBox.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  SelectedItemTextValueMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    ComboBox
  )))));


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

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, ListComboBox, symbols.template);

    // Wrap default slot with a list.
    const listTemplate = template.html`
      <style>
        #list {
          border: none;
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


export default ListComboBox;
customElements.define('elix-list-combo-box', ListComboBox);
