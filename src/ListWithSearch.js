import './FilterListBox.js';
import { html } from './template.js';
import { merge } from './updates.js'
import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';


class ListWithSearch extends ReactiveElement {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.input.addEventListener('input', () => {
      this[symbols.raiseChangeEvents] = true;
      this.setState({
        filter: this.$.input.value
      });
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        if (this.state.selectedIndex < 0) {
          this.setState({ selectedIndex: 0 });
        }
        this.$.list.focus();
        event.preventDefault();
        event.stopPropagation();
      }
    });
    this.$.list.addEventListener('keydown', event => {
      if (event.key === 'ArrowUp') {
        if (this.state.selectedIndex === 0) {
          this.$.input.focus();
          event.preventDefault();
          event.stopPropagation();
        }
      }
    });

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
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      filter: '',
      placeholder: 'Search',
      selectedIndex: -1
    });
  }

  get placeholder() {
    return this.state.placeholder;
  }
  set placeholder(placeholder) {
    this.setState({ placeholder });
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
