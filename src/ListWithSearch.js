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
        if (this.$.list.selectedIndex < 0) {
          this.$.list.selectedIndex = 0;
        }
        this.$.list.focus();
        event.preventDefault();
        event.stopPropagation();
      }
    });
    this.$.list.addEventListener('keydown', event => {
      if (event.key === 'ArrowUp') {
        if (this.$.list.selectedIndex === 0) {
          this.$.input.focus();
          event.preventDefault();
          event.stopPropagation();
        }
      }
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      filter: '',
      placeholder: 'Search'
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
