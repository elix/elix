import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorInViewMixin from "./CursorInViewMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
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
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

const Base = AriaListMixin(
  ComposedFocusMixin(
    CursorAPIMixin(
      CursorInViewMixin(
        CursorSelectMixin(
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
 * Single-selection list box
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
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class ListBox extends Base {
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
    if (changed.items || changed.currentIndex) {
      // Apply `selected` style to the selected item only.
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("selected", index === currentIndex);
        });
      }
    }
    if (changed.orientation) {
      // Update list orientation styling.
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
          display: flex;
          flex: 1;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }
      </style>
      <div id="container" role="none">
        <slot id="slot"></slot>
      </div>
    `);
    return result;
  }
}

export default ListBox;
