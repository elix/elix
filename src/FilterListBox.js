import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import AriaListMixin from './AriaListMixin.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FilterContentItemsMixin from './FilterContentItemsMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import ComposedFocusMixin from './ComposedFocusMixin.js';
import ItemsTextMixin from './ItemsTextMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import KeyboardPagedSelectionMixin from './KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from './KeyboardPrefixSelectionMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin.js';
import SelectionInViewMixin from './SelectionInViewMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const Base =
  AriaListMixin(
  ClickSelectionMixin(
  DirectionSelectionMixin(
  FilterContentItemsMixin(
  FocusVisibleMixin(
  ComposedFocusMixin(
  ItemsTextMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  LanguageDirectionMixin(
  SelectedItemTextValueMixin(
  SelectionInViewMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ReactiveElement
  ))))))))))))))));


class FilterListBox extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'vertical',
      trackSelectedItem: false
    });
  }

  highlightTextInNode(textToHighlight, node) {
    const text = node.textContent;
    const start = text.toLowerCase().indexOf(textToHighlight);
    if (textToHighlight && start >= 0) {
      const end = start + textToHighlight.length;
      const part1 = text.substr(0, start);
      const part2 = text.substring(start, end);
      const part3 = text.substr(end);
      const fragment = document.createDocumentFragment();
      fragment.appendChild(new Text(part1));
      const strong = document.createElement('strong');
      strong.textContent = part2;
      fragment.appendChild(strong);
      fragment.appendChild(new Text(part3));
      return fragment.childNodes;
    } else {
      return [new Text(text)];
    }
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const { matches, selected } = calcs;
    const color = selected ? 'highlighttext' : original.style.color;
    const backgroundColor = selected ? 'highlight' : original.style['background-color'];
    const display = matches ? original.style.display : 'none';
    // TODO: Generalize
    const singleTextNode = item.childNodes.length === 1 &&
      item.childNodes[0] instanceof Text;
    const textToHighlight = matches ?
      this.state.filter.toLowerCase() :
      null;
    const childNodes = singleTextNode && !matches ?
      null :
      this.highlightTextInNode(textToHighlight, item);
    return merge(base, Object.assign(
      {
        classes: {
          selected
        },
        style: {
          'background-color': backgroundColor,
          color,
          display
        }
      },
      childNodes && {
        childNodes
      })
    );
  }

  get orientation() {
    return this.state.orientation;
  }
  set orientation(orientation) {
    this.setState({ orientation });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const filterChanged = state.filter !== this.state.filter;
    if (filterChanged && state.selectedIndex > 0) {
      Object.assign(state, {
        selectedIndex: 0
      });
      result = false;
    }
    return result;
  }

  get [symbols.scrollTarget]() {
    return this.$.content;
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          border: 1px solid gray;
          box-sizing: border-box;
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: transparent;
        }

        #content {
          display: flex;
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }

        #content > ::slotted(*) {
          padding: 0.25em;
        }

        @media (pointer: coarse) {
          #content > ::slotted(*) {
            padding: 1em;
          }
        }

        #content > ::slotted(option) {
          font-weight: inherit;
          min-height: inherit;
        }
      </style>
      <div id="content" role="none">
        <slot></slot>
      </div>
    `;
  }

  get updates() {
    const style = this.state.orientation === 'vertical' ?
      {
        'flex-direction': 'column',
        'overflow-x': 'hidden',
        'overflow-y': 'auto'
      } :
      {
        'flex-direction': 'row',
        'overflow-x': 'auto',
        'overflow-y': 'hidden'
      };
    return merge(super.updates, {
      $: {
        content: { style }
      }
    });
  }

}


customElements.define('elix-filter-list-box', FilterListBox);
export default FilterListBox;
