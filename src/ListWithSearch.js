import './FilterListBox.js';
import { html } from './template.js';
import { merge } from './updates.js'
import * as symbols from './symbols.js';
import DelegateSelectionMixin from './DelegateSelectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SingleSelectionMixin from './SingleSelectionMixin';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  DelegateSelectionMixin(
  DirectionSelectionMixin(
  KeyboardMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    ReactiveElement
  )))));


class ListWithSearch extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.input.addEventListener('input', () => {
      this[symbols.raiseChangeEvents] = true;
      this.setState({
        filter: this.$.input.value
      });
      this[symbols.raiseChangeEvents] = false;
    });

  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      filter: '',
      placeholder: 'Search',
      tabindex: null
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
        handled = event.altKey ? this[symbols.goEnd]() : this[symbols.goDown]();
        break;

      case 'ArrowUp':
        handled = event.altKey ? this[symbols.goStart]() : this[symbols.goUp]();
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

  get placeholder() {
    return this.state.placeholder;
  }
  set placeholder(placeholder) {
    this.setState({ placeholder });
  }

  get [symbols.selectionDelegate]() {
    return this.$.list;
  }

  get [symbols.template]() {
    return html`
      <style>
        :host {
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
        }

        #input {
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
        }
      </style>
      <input id="input">
      <elix-filter-list-box id="list">
        <slot></slot>
      </elix-filter-list-box>
    `;
  }

  get updates() {
    const { filter, placeholder, selectedIndex } = this.state;
    return merge(super.updates, {
      $: {
        input: {
          placeholder
        },
        list: {
          filter,
          selectedIndex
        }
      }
    });
  }

}


customElements.define('elix-list-with-search', ListWithSearch);
export default ListWithSearch;
