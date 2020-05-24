import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorInViewMixin from "./CursorInViewMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
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
import ItemsMultiSelectMixin from "./ItemsMultiSelectMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedCursorMixin from "./KeyboardPagedCursorMixin.js";
import KeyboardPrefixCursorMixin from "./KeyboardPrefixCursorMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import MultiSelectAPIMixin from "./MultiSelectAPIMixin.js";
import MultiSelectToggleMixin from "./MultiSelectToggleMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

const Base = AriaListMixin(
  ComposedFocusMixin(
    CursorAPIMixin(
      CursorInViewMixin(
        DirectionCursorMixin(
          FocusVisibleMixin(
            ItemsAPIMixin(
              ItemsCursorMixin(
                ItemsMultiSelectMixin(
                  ItemsTextMixin(
                    KeyboardDirectionMixin(
                      KeyboardMixin(
                        KeyboardPagedCursorMixin(
                          KeyboardPrefixCursorMixin(
                            LanguageDirectionMixin(
                              MultiSelectAPIMixin(
                                MultiSelectToggleMixin(
                                  SingleSelectAPIMixin(
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
 * Multiple-selection list box
 *
 * This component supports ARIA support and full keyboard navigation. See
 * [KeyboardDirectionMixin](KeyboardDirectionMixin),
 * [KeyboardPagedCursorMixin](KeyboardPagedCursorMixin), and
 * [KeyboardPrefixCursorMixin](KeyboardPrefixCursorMixin) for keyboard
 * details.
 *
 * @inherits ReactiveElement
 * @mixes AriaListMixin
 * @mixes ComposedFocusMixin
 * @mixes CursorInViewMixin
 * @mixes CursorAPIMixin
 * @mixes DirectionCursorMixin
 * @mixes FocusVisibleMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes ItemsMultiSelectMixin
 * @mixes ItemsTextMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedCursorMixin
 * @mixes KeyboardPrefixCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes MultiSelectAPIMixin
 * @mixes MultiSelectToggleMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class MultiSelectListBox extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      orientation: "vertical",
    });
  }

  get orientation() {
    return this[state].orientation;
  }
  set orientation(orientation) {
    this[setState]({ orientation });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    // Apply `active` style to the current item only.
    if (changed.items || changed.currentIndex) {
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("active", index === currentIndex);
        });
      }
    }

    // Apply `selected` style to the selected items.
    if (changed.items || changed.selectedFlags) {
      const { items, selectedFlags } = this[state];
      if (items && selectedFlags) {
        items.forEach((item, index) => {
          item.toggleAttribute("selected", selectedFlags[index]);
        });
      }
    }

    // Update list orientation styling.
    if (changed.orientation) {
      const style =
        this[state].orientation === "vertical"
          ? {
              display: "block",
              flexDirection: "",
              overflowX: "hidden",
              overflowY: "auto",
            }
          : {
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              overflowY: "hidden",
            };
      Object.assign(this[ids].container.style, style);
    }
  }

  get [scrollTarget]() {
    return this[ids].container;
  }

  get [template]() {
    const result = super[template] || fragmentFrom.html``;
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
          display: flex;
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }
      </style>
      <div id="container" role="none">
        <slot></slot>
      </div>
    `);
    return result;
  }
}

export default MultiSelectListBox;
