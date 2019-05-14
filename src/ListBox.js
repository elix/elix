import * as symbols from './symbols.js';
import * as template from './template.js';
import AriaListMixin from './AriaListMixin.js';
import ComposedFocusMixin from './ComposedFocusMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
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
import SlotItemsMixin from './SlotItemsMixin.js';
import TapSelectionMixin from './TapSelectionMixin.js';


const Base =
  AriaListMixin(
  ComposedFocusMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  ItemsTextMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  LanguageDirectionMixin(
  SelectedItemTextValueMixin(
  SelectionInViewMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
  TapSelectionMixin(
    ReactiveElement
  )))))))))))))));


/**
 * Single-selection list box
 *
 * This component supports a generic visual style, ARIA support, and full
 * keyboard navigation. See [KeyboardDirectionMixin](KeyboardDirectionMixin),
 * [KeyboardPagedSelectionMixin](KeyboardPagedSelectionMixin), and
 * [KeyboardPrefixSelectionMixin](KeyboardPrefixSelectionMixin) for keyboard
 * details.
 *
 * @inherits ReactiveElement
 * @mixes AriaListMixin
 * @mixes ComposedFocusMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes ItemsTextMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedSelectionMixin
 * @mixes KeyboardPrefixSelectionMixin
 * @mixes LanguageDirectionMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SelectionInViewMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @mixes TapSelectionMixin
 */
class ListBox extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      orientation: 'vertical'
    });
  }

  get orientation() {
    return this.state.orientation;
  }
  set orientation(orientation) {
    this.setState({ orientation });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.orientation) {
      // Update list orientation styling.
      const style = this.state.orientation === 'vertical' ?
        {
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'auto'
        } :
        {
          flexDirection: 'row',
          overflowX: 'auto',
          overflowY: 'hidden'
        };
      Object.assign(this.$.content.style, style);
    }
    if (changed.items || changed.selectedIndex) {
      // Apply `selected` style to the selected item only.
      const { selectedIndex, items } = this.state;
      if (items) {
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.classList.toggle('selected', selected);
        });
      }
    }
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
          max-height: 100%;
          max-width: 100%;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }

        ::slotted(*) {
          padding: 0.25em;
        }

        ::slotted(.selected) {
          background: highlight;
          color: highlighttext;
        }

        @media (pointer: coarse) {
          ::slotted(*) {
            padding: 1em;
          }
        }

        ::slotted(option) {
          font-weight: inherit;
          min-height: inherit;
        }
      </style>
      <div id="content" role="none">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('elix-list-box', ListBox);
export default ListBox;
