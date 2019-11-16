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

const Base = AriaListMixin(
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
                              SlotItemsMixin(TapSelectionMixin(ReactiveElement))
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

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
 * @mixes GenericMixin
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
    if (changed.items || changed.selectedIndex) {
      // Apply `selected` style to the selected item only.
      const { selectedIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute('selected', index === selectedIndex);
        });
      }
    }
    if (changed.orientation) {
      // Update list orientation styling.
      const style =
        this[internal.state].orientation === 'vertical'
          ? {
              display: 'block',
              flexDirection: '',
              overflowX: 'hidden',
              overflowY: 'auto'
            }
          : {
              display: 'flex',
              flexDirection: 'row',
              overflowX: 'auto',
              overflowY: 'hidden'
            };
      Object.assign(this[internal.ids].container.style, style);
    }
  }

  get [internal.scrollTarget]() {
    return this[internal.ids].container;
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          box-sizing: border-box;
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: transparent;
        }

        :host([generic]) {
          border: 1px solid gray;
        }

        #container {
          display: flex;
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }

        :host([generic]) ::slotted(*) {
          padding: 0.25em;
        }

        :host([generic]) ::slotted([selected]) {
          background: highlight;
          color: highlighttext;
        }

        @media (pointer: coarse) {
          :host([generic]) ::slotted(*) {
            padding: 1em;
          }
        }

        ::slotted(option) {
          font: inherit;
          min-height: inherit;
        }
      </style>
      <div id="container" role="none">
        <slot></slot>
      </div>
    `;
  }
}

export default ListBox;
