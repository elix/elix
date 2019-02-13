import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import AriaMenuMixin from './AriaMenuMixin.js';
import DelegateFocusMixin from './DelegateFocusMixin.js';
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
  AriaMenuMixin(
  DelegateFocusMixin(
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
 * A menu of choices or commands
 * 
 * This holds the contents of the menu, not the top-level UI element that invokes
 * a menu. For that, see [MenuButton](MenuButton) or [PopupSource](PopupSource).
 * 
 * @inherits ReactiveElement
 * @mixes AriaMenuMixin
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
class Menu extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    
    this.addEventListener('mousemove', () => {
      this.suppressFocusVisibility();
    });

    // Treat a pointerdown event as a tap.
    if ('PointerEvent' in window) {
      // Prefer listening to standard pointer events.
      this.addEventListener('pointerdown', event =>
        this[symbols.tap](event));
    } else {
      this.addEventListener('touchstart', event =>
        this[symbols.tap](event));
    }
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    const selectedIndexChanged = this.state.selectedIndex !== previousState.selectedIndex;
    if (selectedIndexChanged && !this.state.selectionFocused) {
      // The selected item needs the focus, but this is complicated. See notes
      // in itemUpdates.
      const focusElement = this.selectedItem instanceof HTMLElement ?
        this.selectedItem :
        this;
      focusElement.focus();

      // Now that the selection has been focused, we can remove/reset the
      // tabindex on any item that had previously been selected.
      this.setState({
        selectionFocused: true
      });
    }
  }

  get defaultState() {
    const state = Object.assign(super.defaultState, {
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
    const keyboardActive = this.state.focusVisible;
    const probablyDesktop = matchMedia('(pointer: fine)').matches;
    if (keyboardActive || probablyDesktop) {
      const flashDuration = 75; // milliseconds
      this.setState({ highlightSelection: false });
      await new Promise(resolve => setTimeout(resolve, flashDuration));
      this.setState({ highlightSelection: true });
      await new Promise(resolve => setTimeout(resolve, flashDuration));
    }
  }

  // Filter the set of items to ignore disabled items.
  [symbols.itemMatchesState](item, state) {
    const base = super[symbols.itemMatchesState] ?
      super[symbols.itemMatchesState](item, state) :
      true;
    return base && !item.disabled;
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const selected = calcs.selected;
    const showSelection = selected && this.state.highlightSelection;
    const color = showSelection ? 'highlighttext' : original.style.color;
    const backgroundColor = showSelection ? 'highlight' : original.style['background-color'];

    // A menu has a complicated focus arrangement in which the selected item has
    // focus, which means it needs a tabindex. However, we don't want any other
    // item in the menu to have a tabindex, so that if the user presses Tab or
    // Shift+Tab, they move away from the menu entirely (rather than just moving
    // to the next or previous item).
    // 
    // That's already complex, but to make things worse, if we remove the
    // tabindex from an item that has the focus, the focus gets moved to the
    // document. In popup menus, the popup will conclude it's lost the focus,
    // and implicitly close. So we want to move the focus in two phases: 1) set
    // tabindex on newly-selected item so we can focus on it, 2) after the new
    // item has been focused, remove the tabindex from any previously-selected
    // item (via itemUpdates) and from the menu itself (via the updates
    // property).
    const originalTabindex = original.attributes.tabindex;
    let attributes = {};
    const isDefaultFocusableItem = this.state.selectedIndex < 0 && calcs.index === 0;
    if (!this.state.selectionFocused) {
      // Phase 1: Add tabindex to newly-selected item.
      if (selected || isDefaultFocusableItem) {
        attributes.tabindex = originalTabindex || 0;
      }
    } else {
      // Phase 2: Remove tabindex from any previously-selected item.
      if (!(selected || isDefaultFocusableItem)) {
        attributes.tabindex = originalTabindex || null;
      }
    }

    const outline = (selected && !this.state.focusVisible) || isDefaultFocusableItem ?
      'none' :
      null;

    return merge(base, {
      attributes,
      classes: {
        selected
      },
      style: {
        'background-color': backgroundColor,
        color,
        outline
      }
    });
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
          touch-action: manipulation;
        }

        #content {
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }
        
        #content > ::slotted(*) {
          flex-shrink: 0;
          padding: 0.25em;
          touch-action: manipulation;
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
    return merge(super.updates, {
      attributes: {
        tabindex: null
      }
    });
  }

}


export default Menu;
customElements.define('elix-menu', Menu);
