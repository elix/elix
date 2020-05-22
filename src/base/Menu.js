import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaMenuMixin from "./AriaMenuMixin.js";
import CurrentItemInViewMixin from "./CurrentItemInViewMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import {
  defaultState,
  firstRender,
  ids,
  itemAvailableInState,
  render,
  rendered,
  scrollTarget,
  setState,
  state,
  stateEffects,
  tap,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedCursorMixin from "./KeyboardPagedCursorMixin.js";
import KeyboardPrefixCursorMixin from "./KeyboardPrefixCursorMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

const Base = AriaMenuMixin(
  CurrentItemInViewMixin(
    CursorAPIMixin(
      DelegateFocusMixin(
        DirectionCursorMixin(
          ItemsAPIMixin(
            ItemsCursorMixin(
              ItemsTextMixin(
                KeyboardDirectionMixin(
                  KeyboardMixin(
                    KeyboardPagedCursorMixin(
                      KeyboardPrefixCursorMixin(
                        LanguageDirectionMixin(
                          SelectedItemTextValueMixin(
                            SlotItemsMixin(TapCursorMixin(ReactiveElement))
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
 * @mixes CursorAPIMixin
 * @mixes DelegateFocusMixin
 * @mixes DirectionCursorMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes ItemsTextMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedCursorMixin
 * @mixes KeyboardPrefixCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes CurrentItemInViewMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class Menu extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      highlightCurrentItem: true,
      orientation: "vertical",
      currentItemFocused: false,
    });
  }

  /**
   * Flash the current item.
   *
   * By default, this uses a heuristic to guess whether the menu was closed by a
   * keyboard or mouse (on desktop). If so, the menu flashes the current item
   * off then back on, emulating the menu item selection effect in macOS.
   * Otherwise, it does nothing.
   */
  async flashCurrentItem() {
    const keyboardActive = this[state].focusVisible;
    const probablyDesktop = matchMedia("(pointer: fine)").matches;
    if (keyboardActive || probablyDesktop) {
      const flashDuration = 75; // milliseconds
      this[setState]({ highlightCurrentItem: false });
      await new Promise((resolve) => setTimeout(resolve, flashDuration));
      this[setState]({ highlightCurrentItem: true });
      await new Promise((resolve) => setTimeout(resolve, flashDuration));
    }
  }

  /**
   * Returns true if the given item is available in the given state.
   *
   * @param {ListItemElement} item
   * @param {PlainObject} state
   */
  [itemAvailableInState](item, state) {
    const base = super[itemAvailableInState]
      ? super[itemAvailableInState](item, state)
      : true;
    /** @type {any} */ const cast = item;
    return base && !cast.disabled;
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      // Treat a pointerdown event as a tap.
      if ("PointerEvent" in window) {
        // Prefer listening to standard pointer events.
        this.addEventListener("pointerdown", (event) => this[tap](event));
      } else {
        this.addEventListener("touchstart", (event) => this[tap](event));
      }

      this.removeAttribute("tabindex");
    }

    const { currentIndex, items } = this[state];

    // Highlight the current item.
    if (
      (changed.items || changed.currentIndex || changed.highlightCurrentItem) &&
      items
    ) {
      const { highlightCurrentItem } = this[state];
      items.forEach((item, index) => {
        item.toggleAttribute(
          "current",
          highlightCurrentItem && index === currentIndex
        );
      });
    }

    if (
      (changed.items ||
        changed.currentIndex ||
        changed.currentItemFocused ||
        changed.focusVisible) &&
      items
    ) {
      // A menu has a complicated focus arrangement in which the current item has
      // focus, which means it needs a tabindex. However, we don't want any other
      // item in the menu to have a tabindex, so that if the user presses Tab or
      // Shift+Tab, they move away from the menu entirely (rather than just moving
      // to the next or previous item).
      //
      // That's already complex, but to make things worse, if we remove the
      // tabindex from an item that has the focus, the focus gets moved to the
      // document. In popup menus, the popup will conclude it's lost the focus,
      // and implicitly close. So we want to move the focus in two phases: 1)
      // set tabindex on a newly-current item so we can focus on it, 2) after
      // the new item has been focused, remove the tabindex from any
      // previous item.
      items.forEach((item, index) => {
        const current = index === currentIndex;
        const isDefaultFocusableItem = currentIndex < 0 && index === 0;
        if (!this[state].currentItemFocused) {
          // Phase 1: Add tabindex to newly-current item.
          if (current || isDefaultFocusableItem) {
            item.tabIndex = 0;
          }
        } else {
          // Phase 2: Remove tabindex from any previous item.
          if (!(current || isDefaultFocusableItem)) {
            item.removeAttribute("tabindex");
          }
        }
      });
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);
    if (
      !this[firstRender] &&
      changed.currentIndex &&
      !this[state].currentItemFocused
    ) {
      // The current item needs the focus, but this is complicated. See notes
      // in render.
      const { currentItem } = this[state];
      const focusElement =
        currentItem instanceof HTMLElement ? currentItem : this;
      focusElement.focus();

      // Now that the current item has been focused, we can remove/reset the
      // tabindex on any item that had previously been current.
      this[setState]({
        currentItemFocused: true,
      });
    }
  }

  get [scrollTarget]() {
    return this[ids].content;
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When current item changes, we'll need to focus on it in rendered.
    if (changed.currentIndex) {
      Object.assign(effects, {
        currentItemFocused: false,
      });
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          box-sizing: border-box;
          cursor: default;
          display: inline-flex;
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
          outline: none;
          touch-action: manipulation;
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
