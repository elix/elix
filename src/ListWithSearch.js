import { forwardFocus } from './utilities.js';
import { html } from './template.js';
import { merge } from './updates.js'
import * as symbols from './symbols.js';
import * as template from './template.js';
import DelegateSelectionMixin from './DelegateSelectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FilterListBox from './FilterListBox.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';


const Base =
  DelegateSelectionMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  SelectedItemTextValueMixin(
  SingleSelectionMixin(
    ReactiveElement
  ))))));


/**
 * A list accompanied by a search box
 * 
 * @inherits ReactiveElement
 * @mixes DelegateSelectionMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SingleSelectionMixin
 * @elementrole {AutoCompleteInput} input
 * @elementRole {FilterListBox} list
 */
class ListWithSearch extends Base {

  constructor() {
    super();
    this[symbols.renderedRoles] = {
      listRole: FilterListBox
    };
  }

  // Forward any ARIA label to the input element.
  get ariaLabel() {
    return this.state.ariaLabel;
  }
  set ariaLabel(ariaLabel) {
    this.setState({ ariaLabel });
  }

  [symbols.beforeUpdate]() {
    const inputRoleChanged = this[symbols.renderedRoles].inputRole !== this.state.inputRole;
    const listRoleChanged = this[symbols.renderedRoles].listRole !== this.state.listRole;
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (inputRoleChanged) {
      template.transmute(this.$.input, this.state.inputRole);
      this.$.input.addEventListener('input', () => {
        this[symbols.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = this.$.input;
        this.setState({
          filter: cast.value
        });
        this[symbols.raiseChangeEvents] = false;
      });
      this[symbols.renderedRoles].inputRole = this.state.inputRole;
    }
    if (listRoleChanged) {
      template.transmute(this.$.list, this.state.listRole);
      this[symbols.renderedRoles].listRole = this.state.listRole;
    }
    if ((inputRoleChanged || listRoleChanged) &&
      this.$.list instanceof HTMLElement &&
      this.$.input instanceof HTMLElement) {
      forwardFocus(this.$.list, this.$.input);
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      ariaLabel: '',
      filter: '',
      inputRole: 'input',
      listRole: FilterListBox,
      placeholder: 'Search',
      tabindex: null
    });
  }
  
  get filter() {
    return this.state.filter;
  }
  set filter(filter) {
    this.setState({ filter });
  }

  /**
   * The class, tag, or template used to create the input element.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default 'input'
   */
  get inputRole() {
    return this.state.inputRole;
  }
  set inputRole(inputRole) {
    this.setState({ inputRole });
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
          const items = this.items;
          if (items) {
            handled = this.selectedIndex < items.length - 1;
          }
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
    const { filter, placeholder } = this.state;
    return merge(super.updates, {
      $: {
        input: {
          attributes: {
            'aria-label': this.state.ariaLabel
          },
          placeholder,
          value: filter
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
