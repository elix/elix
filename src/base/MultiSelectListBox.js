import * as internal from "./internal.js";
import * as template from "../core/template.js";
// import AriaListMixin from "./AriaListMixin.js";
// import ComposedFocusMixin from "./ComposedFocusMixin.js";
// import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
// import FocusVisibleMixin from "./FocusVisibleMixin.js";
// import FormElementMixin from "./FormElementMixin.js";
import html from "../core/html.js";
// import ItemsTextMixin from "./ItemsTextMixin.js";
// import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
// import KeyboardMixin from "./KeyboardMixin.js";
// import KeyboardPagedSelectionMixin from "./KeyboardPagedSelectionMixin.js";
// import KeyboardPrefixSelectionMixin from "./KeyboardPrefixSelectionMixin.js";
// import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
// import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
// import SelectionInViewMixin from "./SelectionInViewMixin.js";
// import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import MultiSelectionMixin from "./MultiSelectionMixin.js";
import TapToggleMixin from "./TapToggleMixin.js";
// import TapSelectionMixin from "./TapSelectionMixin.js";

const Base =
  // AriaListMixin(
  //   ComposedFocusMixin(
  //     DirectionSelectionMixin(
  //       FocusVisibleMixin(
  //         FormElementMixin(
  //           ItemsTextMixin(
  //             KeyboardDirectionMixin(
  //               KeyboardMixin(
  //                 KeyboardPagedSelectionMixin(
  //                   KeyboardPrefixSelectionMixin(
  //                     LanguageDirectionMixin(
  //                       SelectedItemTextValueMixin(
  //                         SelectionInViewMixin(
  //                           SingleSelectionMixin(
  MultiSelectionMixin(
    SlotItemsMixin(
      //                               TapSelectionMixin(
      TapToggleMixin(ReactiveElement)
    )
    //                             )
    //                           )
    //                         )
    //                       )
    //                     )
    //                   )
    //                 )
    //               )
    //             )
    //           )
    //         )
    //       )
    //     )
    //   )
    // )
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
class MultiSelectListBox extends Base {
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

    // Apply `selected` style to the selected items.
    if (changed.items || changed.selectedIndices) {
      const { items, selectedIndices } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          const selected = !!selectedIndices[index];
          item.toggleAttribute("selected", selected);
        });
      }
    }

    // Update list orientation styling.
    if (changed.orientation) {
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
    const result = super[internal.template] || template.html``;
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
