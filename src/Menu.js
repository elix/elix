import * as internal from './internal.js';
import * as template from './template.js';
import AriaMenuMixin from './AriaMenuMixin.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
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

const Base = AriaMenuMixin(
  DelegateFocusMixin(
    DirectionSelectionMixin(
      FocusVisibleMixin(
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
);

/**
 * A menu of choices or commands
 *
 * This holds the contents of the menu, not the top-level UI element that invokes
 * a menu. For that, see [MenuButton](MenuButton) or [PopupSource](PopupSource).
 *
 * @inherits ReactiveElement
 * @mixes AriaMenuMixin
 * @mixes DelegateFocusMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes GenericMixin
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
class Menu extends Base {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();

    this.addEventListener('mousemove', () => {
      this.suppressFocusVisibility();
    });

    // Treat a pointerdown event as a tap.
    if ('PointerEvent' in window) {
      // Prefer listening to standard pointer events.
      this.addEventListener('pointerdown', event => this[internal.tap](event));
    } else {
      this.addEventListener('touchstart', event => this[internal.tap](event));
    }

    this.removeAttribute('tabindex');
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);
    if (changed.selectedIndex && !this[internal.state].selectionFocused) {
      // The selected item needs the focus, but this is complicated. See notes
      // in render.
      const focusElement =
        this.selectedItem instanceof HTMLElement ? this.selectedItem : this;
      focusElement.focus();

      // Now that the selection has been focused, we can remove/reset the
      // tabindex on any item that had previously been selected.
      this[internal.setState]({
        selectionFocused: true
      });
    }
  }

  get [internal.defaultState]() {
    const state = Object.assign(super[internal.defaultState], {
      highlightSelection: true,
      orientation: 'vertical',
      selectionFocused: false
    });

    // When selection changes, we'll need to focus on it in componentDidUpdate.
    state.onChange('selectedIndex', () => ({
      selectionFocused: false
    }));

    return state;
  }

  /**
   * Highlight the selected item.
   *
   * By default, this uses a heuristic to guess whether the menu was closed by a
   * keyboard or mouse. If so, the menu flashes the selected item off then back
   * on, emulating the menu item selection effect in macOS. Otherwise, it does
   * nothing.
   */
  async highlightSelectedItem() {
    const keyboardActive = this[internal.state].focusVisible;
    const probablyDesktop = matchMedia('(pointer: fine)').matches;
    if (keyboardActive || probablyDesktop) {
      const flashDuration = 75; // milliseconds
      this[internal.setState]({ highlightSelection: false });
      await new Promise(resolve => setTimeout(resolve, flashDuration));
      this[internal.setState]({ highlightSelection: true });
      await new Promise(resolve => setTimeout(resolve, flashDuration));
    }
  }

  /**
   * Returns true if the given item should be shown in the indicated state.
   *
   * @param {ListItemElement} item
   * @param {PlainObject} state
   */
  [internal.itemMatchesState](item, state) {
    const base = super[internal.itemMatchesState]
      ? super[internal.itemMatchesState](item, state)
      : true;
    /** @type {any} */ const cast = item;
    return base && !cast.disabled;
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    const { selectedIndex, items } = this[internal.state];
    if ((changed.items || changed.selectedIndex) && items) {
      // Reflect the selection state to the item.
      items.forEach((item, index) => {
        item.toggleAttribute('selected', index === selectedIndex);
      });
    }
    if (
      (changed.items ||
        changed.selectedIndex ||
        changed.selectionFocused ||
        changed.focusVisible) &&
      items
    ) {
      // A menu has a complicated focus arrangement in which the selected item has
      // focus, which means it needs a tabindex. However, we don't want any other
      // item in the menu to have a tabindex, so that if the user presses Tab or
      // Shift+Tab, they move away from the menu entirely (rather than just moving
      // to the next or previous item).
      //
      // That's already complex, but to make things worse, if we remove the
      // tabindex from an item that has the focus, the focus gets moved to the
      // document. In popup menus, the popup will conclude it's lost the focus,
      // and implicitly close. So we want to move the focus in two phases: 1)
      // set tabindex on a newly-selected item so we can focus on it, 2) after
      // the new item has been focused, remove the tabindex from any
      // previously-selected item.
      items.forEach((item, index) => {
        const selected = index === selectedIndex;
        const isDefaultFocusableItem = selectedIndex < 0 && index === 0;
        if (!this[internal.state].selectionFocused) {
          // Phase 1: Add tabindex to newly-selected item.
          if (selected || isDefaultFocusableItem) {
            item.tabIndex = 0;
          }
        } else {
          // Phase 2: Remove tabindex from any previously-selected item.
          if (!(selected || isDefaultFocusableItem)) {
            item.removeAttribute('tabindex');
          }
        }

        // Don't show focus on selected item if we're suppressing the focus
        // (because the mouse was used for selection) or if the item was
        // selected by default when the menu opened.
        const suppressFocus =
          (selected && !this[internal.state].focusVisible) ||
          isDefaultFocusableItem;
        item.style.outline = suppressFocus ? 'none' : '';
      });
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
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        #content {
          display: flex;
          flex: 1;
          flex-direction: column;
          max-height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }
        
        ::slotted(*) {
          flex-shrink: 0;
          touch-action: manipulation;
        }

        :host([generic]) ::slotted(*) {
          padding: 0.25em;
        }
        :host([generic]) ::slotted([selected]) {
          background: highlight;
          color: highlighttext;
        }

        @media (pointer: coarse) {
          ::slotted(*) {
            padding: 1em;
          }
        }

        ::slotted(option) {
          font: inherit;
          min-height: inherit;
        }
      </style>
      <div id="content" role="none">
        <slot></slot>
      </div>
    `;
  }
}

export default Menu;
