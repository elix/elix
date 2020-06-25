import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorInViewMixin from "./CursorInViewMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import {
  defaultState,
  ids,
  render,
  scrollTarget,
  setState,
  state,
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
import SelectedTextAPIMixin from "./SelectedTextAPIMixin.js";
import SelectedValueAPIMixin from "./SelectedValueAPIMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

const Base = AriaRoleMixin(
  ComposedFocusMixin(
    CursorAPIMixin(
      CursorInViewMixin(
        DirectionCursorMixin(
          FocusVisibleMixin(
            FormElementMixin(
              ItemsAPIMixin(
                ItemsCursorMixin(
                  ItemsTextMixin(
                    KeyboardDirectionMixin(
                      KeyboardMixin(
                        KeyboardPagedCursorMixin(
                          KeyboardPrefixCursorMixin(
                            LanguageDirectionMixin(
                              SingleSelectAPIMixin(
                                SelectedTextAPIMixin(
                                  SelectedValueAPIMixin(
                                    SlotItemsMixin(
                                      TapCursorMixin(ReactiveElement)
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
        )
      )
    )
  )
);

/**
 * A list of options.
 *
 * This is similar to [ListBox](ListBox) and [Menu](Menu), but designed for use
 * in [DropdownList](DropdownList) to present a menu of [Option](Option)
 * elements. Among other things, it does not assume that the selected item and
 * the current item are the same. It also avoids the special focus behavior of
 * `Menu`.
 *
 * @inherits ReactiveElement
 * @mixes AriaRoleMixin
 * @mixes ComposedFocusMixin
 * @mixes CursorInViewMixin
 * @mixes CursorAPIMixin
 * @mixes DirectionCursorMixin
 * @mixes FocusVisibleMixin
 * @mixes FormElementMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes ItemsTextMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedCursorMixin
 * @mixes KeyboardPrefixCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes SelectedTextAPIMixin
 * @mixes SelectedValueAPIMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class OptionList extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      highlightCurrentItem: true,
      orientation: "vertical",
      role: "listbox",
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

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    // Highlight the current item.
    if (changed.items || changed.currentIndex || changed.highlightCurrentItem) {
      const { currentIndex, items, highlightCurrentItem } = this[state];
      if (items) {
        items.forEach((item, index) => {
          const current = index === currentIndex;

          // Show visible highlight unless we're surpressing that.
          item.toggleAttribute("current", highlightCurrentItem && current);

          // For ARIA purposes, we want to announce the current item as the
          // selected item.
          item.setAttribute("aria-selected", String(current));
        });
      }
    }
  }

  get [scrollTarget]() {
    return this[ids].container;
  }

  get [template]() {
    const result = super[template];
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          box-sizing: border-box;
          cursor: default;
          display: flex;
          overflow: hidden; /* Container element is responsible for scrolling */
          -webkit-tap-highlight-color: transparent;
        }

        #container {
          display: "block";
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          overflow-x: "hidden";
          overflow-y: "auto";
        }
      </style>
      <div id="container" role="none">
        <slot id="slot"></slot>
      </div>
    `);
    return result;
  }
}

export default OptionList;
