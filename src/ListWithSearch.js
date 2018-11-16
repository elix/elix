import './FilterListBox.js';
import { html } from './template.js';
import { merge } from './updates.js'
import * as symbols from './symbols.js';
import DelegateSelectionMixin from './DelegateSelectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import { forwardFocus } from './utilities.js';


const Base =
  DelegateSelectionMixin(
  DirectionSelectionMixin(
  KeyboardMixin(
  KeyboardDirectionMixin(
  SingleSelectionMixin(
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
    if (this.$.list instanceof HTMLElement &&
        this.$.input instanceof HTMLElement) {
      forwardFocus(this.$.list, this.$.input);
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      filter: '',
      placeholder: 'Search',
      tabindex: null,
      trackSelectedItem: false
    });
  }

  [symbols.keydown](event) {

    let handled;
    /** @type {any} */
    const list = this.$.list;

    // Forward Page Down/Page Up to the list element.
    //
    // This gets a little more complex than we'd like. The pageUp/pageDown
    // methods may update the list's selectedIndex, which in turn will
    // eventually update the selectedIndex of this component. In the meantime,
    // other keydown processing can set state, which will trigger a render. When
    // this component is asked for updates, it'll return the current (i.e. old)
    // selectedIndex value, and overwrite the list's own, newer selectedIndex.
    // To avoid this, we wait for the component to finish processing the keydown
    // using timeout timing, then invoke pageUp/pageDown.
    //
    // This forces us to speculate about whether pageUp/pageDown will update the
    // selection so that we can synchronously return an indication of whether
    // the key event was handled. 
    switch (event.key) {

      case 'PageDown':
        if (list.pageDown) {
          setTimeout(() => list.pageDown());
          handled = this.selectedIndex < this.items.length - 1;
        }
        break;
        
      case 'PageUp':
        if (list.pageUp) {
          setTimeout(() => list.pageUp());
          handled = this.selectedIndex > 0;
        }
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

  // TODO: Roles
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
      <elix-filter-list-box id="list" selection-required="true">
        <slot></slot>
      </elix-filter-list-box>
    `;
  }

  get updates() {
    const { filter, placeholder } = this.state;
    return merge(super.updates, {
      $: {
        input: {
          placeholder
        },
        list: {
          filter
        }
      }
    });
  }

}


customElements.define('elix-list-with-search', ListWithSearch);
export default ListWithSearch;
