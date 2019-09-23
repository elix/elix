import * as internal from './internal.js';
import * as template from './template.js';
import AriaListMixin from './AriaListMixin.js';
import ComposedFocusMixin from './ComposedFocusMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import FormElementMixin from './FormElementMixin.js';
import GenericMixin from './GenericMixin.js';
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
  FormElementMixin(
  GenericMixin(
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
  )))))))))))))))));


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
 * @mixes FormElementMixin
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

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      orientation: 'vertical'
    });
  }

  get orientation() {
    return this[internal.state].orientation;
  }
  set orientation(orientation) {
    this[internal.setState]({ orientation });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.generic) {
      const { generic } = this[internal.state];
      this.classList.toggle('generic', generic);
    }
    if (changed.items || changed.selectedIndex) {
      // Apply `selected` style to the selected item only.
      const { selectedIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.classList.toggle('selected', selected);
        });
      }
    }
    if (changed.orientation) {
      // Update list orientation styling.
      const style = this[internal.state].orientation === 'vertical' ?
        {
          display: 'block',
          flexDirection: '',
          overflowX: 'hidden',
          overflowY: 'auto'
        } :
        {
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          overflowY: 'hidden'
        };
      Object.assign(this[internal.ids].content.style, style);
    }
  }

  get [internal.scrollTarget]() {
    return this[internal.ids].content;
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          box-sizing: border-box;
          cursor: default;
          display: flex;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }

        #content {
          flex: 1;
          max-height: 100%;
          max-width: 100%;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }

        :host(.generic) {
          border: 1px solid gray;
        }

        :host(.generic) ::slotted(*) {
          padding: 0.25em;
        }

        :host(.generic) ::slotted(.selected) {
          background: highlight;
          color: highlighttext;
        }

        @media (pointer: coarse) {
          :host(.generic) ::slotted(*) {
            padding: 1em;
          }
        }

        ::slotted(option) {
          font-weight: inherit;
          min-height: inherit;
        }
      </style>
      <div id="content" class="generic" role="none">
        <slot></slot>
      </div>
    `;
  }

}


export default ListBox;
