import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import * as internal from "./internal.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedSelectionMixin from "./KeyboardPagedSelectionMixin.js";
import KeyboardPrefixSelectionMixin from "./KeyboardPrefixSelectionMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SelectionInViewMixin from "./SelectionInViewMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapSelectionMixin from "./TapSelectionMixin.js";

const Base = AriaListMixin(
  ComposedFocusMixin(
    DirectionCursorMixin(
      FocusVisibleMixin(
        FormElementMixin(
          ItemsCursorMixin(
            ItemsTextMixin(
              KeyboardDirectionMixin(
                KeyboardMixin(
                  KeyboardPagedSelectionMixin(
                    KeyboardPrefixSelectionMixin(
                      LanguageDirectionMixin(
                        SelectedItemTextValueMixin(
                          SelectionInViewMixin(
                            SingleSelectAPIMixin(
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
 * This component supports ARIA support and full keyboard navigation. See
 * [KeyboardDirectionMixin](KeyboardDirectionMixin),
 * [KeyboardPagedSelectionMixin](KeyboardPagedSelectionMixin), and
 * [KeyboardPrefixSelectionMixin](KeyboardPrefixSelectionMixin) for keyboard
 * details.
 *
 * @inherits ReactiveElement
 * @mixes AriaListMixin
 * @mixes ComposedFocusMixin
 * @mixes DirectionCursorMixin
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
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapSelectionMixin
 */
class ListBox extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      orientation: "vertical",
    });
  }

  get orientation() {
    return this[internal.state].orientation;
  }
  set orientation(orientation) {
    this[internal.setState]({ orientation });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (changed.items || changed.currentIndex) {
      // Apply `selected` style to the selected item only.
      const { currentIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("selected", index === currentIndex);
        });
      }
    }
    if (changed.orientation) {
      // Update list orientation styling.
      const style =
        this[internal.state].orientation === "vertical"
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
      Object.assign(this[internal.ids].container.style, style);
    }
  }

  get [internal.scrollTarget]() {
    return this[internal.ids].container;
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(html`
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

export default ListBox;
