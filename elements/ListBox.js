import * as props from '../mixins/props.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import ElementBase from './ElementBase.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import KeyboardPagedSelectionMixin from '../mixins/KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from '../mixins/KeyboardPrefixSelectionMixin.js';
import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin.js';
import SelectedItemTextValueMixin from '../mixins/SelectedItemTextValueMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SelectionInViewMixin from '../mixins/SelectionInViewMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  ClickSelectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  LanguageDirectionMixin(
  SelectedItemTextValueMixin(
  SelectionAriaMixin(
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
 * @mixes SelectionAriaMixin
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

  itemProps(item, calcs, original) {
    const base = super.itemProps ? super.itemProps(item, calcs, original) : {};
    const selected = calcs.selected;
    const color = selected ? 'highlighttext' : original.style.color;
    const backgroundColor = selected ? 'highlight' : original.style['background-color'];
    return props.merge(base, {
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

  get props() {
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
    return props.merge(super.props, {
      $: {
        content: { style }
      }
    });
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

  get [symbols.scrollTarget]() {
    return this.$.content;
  }

}


customElements.define('elix-list-box', ListBox);
