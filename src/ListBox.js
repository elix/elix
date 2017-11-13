import { merge } from './updates.js';
import AriaListMixin from './AriaListMixin.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import ElementBase from './ElementBase.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import KeyboardPagedSelectionMixin from './KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from './KeyboardPrefixSelectionMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SelectedItemTextValueMixin from './SelectedItemTextValueMixin.js';
import SelectionInViewMixin from './SelectionInViewMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
import symbols from './symbols.js';


const Base =
  AriaListMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  LanguageDirectionMixin(
  SelectedItemTextValueMixin(
  SelectionInViewMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )))))))))))));


/**
 * A simple single-selection list box.
 *
 * This component supports a generic visual style, ARIA support, and full
 * keyboard navigation. See `KeyboardDirectionMixin`,
 * `KeyboardPagedSelectionMixin`, and `KeyboardPrefixSelectionMixin` for
 * keyboard details.
 *
 * @mixes ClickSelectionMixin
 * @mixes ContentItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedSelectionMixin
 * @mixes KeyboardPrefixSelectionMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes AriaListMixin
 * @mixes SelectionInViewMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 */
export default class ListBox extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'vertical'
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const selected = calcs.selected;
    const color = selected ? 'highlighttext' : original.style.color;
    const backgroundColor = selected ? 'highlight' : original.style['background-color'];
    return merge(base, {
      classes: {
        selected
      },
      style: {
        'background-color': backgroundColor,
        color,
        'padding': '0.25em'
      }
    });
  }

  get orientation() {
    return this.state.orientation;
  }
  set orientation(orientation) {
    this.setState({ orientation });
  }

  get [symbols.scrollTarget]() {
    return this.$.content;
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          border: 1px solid gray;
          box-sizing: border-box;
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        #content {
          display: flex;
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
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
        'overflow-y': 'scroll'
      } :
      {
        'flex-direction': 'row',
        'overflow-x': 'scroll',
        'overflow-y': 'hidden'
      };
    return merge(super.updates, {
      $: {
        content: { style }
      }
    });
  }

}


customElements.define('elix-list-box', ListBox);
