import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import {
  defaultState,
  firstRender,
  ids,
  render,
  scrollTarget,
  setState,
  state,
  template,
} from "./internal.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import ItemsMultiSelectMixin from "./ItemsMultiSelectMixin.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedSelectionMixin from "./KeyboardPagedSelectionMixin.js";
import KeyboardPrefixSelectionMixin from "./KeyboardPrefixSelectionMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import MultiSelectAPIMixin from "./MultiSelectAPIMixin.js";
import MultiSelectToggleMixin from "./MultiSelectToggleMixin.js";
import SelectionInViewMixin from "./SelectionInViewMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = AriaListMixin(
  ComposedFocusMixin(
    DirectionSelectionMixin(
      FocusVisibleMixin(
        ItemsCursorMixin(
          ItemsMultiSelectMixin(
            ItemsTextMixin(
              KeyboardDirectionMixin(
                KeyboardMixin(
                  KeyboardPagedSelectionMixin(
                    KeyboardPrefixSelectionMixin(
                      LanguageDirectionMixin(
                        SelectionInViewMixin(
                          MultiSelectAPIMixin(
                            MultiSelectToggleMixin(
                              SingleSelectAPIMixin(
                                SlotItemsMixin(ReactiveElement)
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
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapSelectionMixin
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

    if (this[firstRender]) {
      // Let ARIA know this is a multi-select list box.
      this.setAttribute("aria-multiselectable", "true");
    }

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
    const result = super[template] || html``;
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

export default MultiSelectListBox;
