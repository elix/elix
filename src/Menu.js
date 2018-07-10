import { merge } from './updates.js';
import * as symbols from './symbols.js';
import AriaMenuMixin from './AriaMenuMixin.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
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


const Base =
  AriaMenuMixin(
  ClickSelectionMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  LanguageDirectionMixin(
  SelectedItemTextValueMixin(
  SelectionInViewMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
    ReactiveElement
  )))))))))))));


/**
 * A menu of choices or commands.
 * 
 * This holds the contents of the menu, not the top-level UI element that invokes
 * a menu. For that, see [MenuButton](MenuButton) or [PopupSource](PopupSource).
 * 
 * @inherits ReactiveElement
 * @mixes AriaMenuMixin
 * @mixes ClickSelectionMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedSelectionMixin
 * @mixes KeyboardPrefixSelectionMixin
 * @mixes LanguageDirectionMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SelectionInViewMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 */
class Menu extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    
    this.addEventListener('mousemove', () => {
      this.suppressFocusVisibility();
    });

    // Treat a pointerdown event as a click.
    if ('PointerEvent' in window) {
      // Prefer listening to standard pointer events.
      this.addEventListener('pointerdown', event =>
        this[symbols.click](event));
    } else {
      this.addEventListener('touchstart', event =>
        this[symbols.click](event));
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

  get [symbols.defaultFocus]() {
    return this.selectedItem;
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'vertical',
      selectionFocused: false
    });
  }

  // Filter the set of items to ignore disabled items.
  itemsForState(state) {
    const base = super.itemsForState(state);
    return base ?
      base.filter((/** @type {any} */ item) => !item.disabled) :
      [];
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const selected = calcs.selected;
    const color = selected ? 'highlighttext' : original.style.color;
    const backgroundColor = selected ? 'highlight' : original.style['background-color'];
    const outline = selected && !this.state.focusVisible ?
      'none' :
      null;

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
    if (!this.state.selectionFocused) {
      // Phase 1: Add tabindex to newly-selected item.
      if (selected) {
        attributes.tabindex = originalTabindex || 0;
      }
    } else {
      // Phase 2: Remove tabindex from any previously-selected item.
      if (!selected) {
        attributes.tabindex = originalTabindex || null;
      }
    }

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

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const selectedIndexChanged = state.selectedIndex !== this.state.selectedIndex;
    if (selectedIndexChanged && state.selectionFocused) {
      // The new selected item is not yet focused.
      state.selectionFocused = false;
      result = false;
    }
    return result;
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
    const base = super.updates;
    const originalTabIndex = this.state.original &&
      this.state.original.attributes.tabindex;
    // We remove focus from the menu itself if a selected item has been focused.
    // See notes at itemUpdates.
    const tabindex = originalTabIndex ||
      this.state.selectedIndex >= 0 && this.state.selectionFocused ?
        null :
        base.attributes && base.attributes.tabindex;
    return merge(base, {
      attributes: {
        tabindex
      }
    });
  }

}


export default Menu;
customElements.define('elix-menu', Menu);
