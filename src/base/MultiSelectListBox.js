import { indexOfItemContainingTarget } from "../core/dom.js";
// import FormElementMixin from "./FormElementMixin.js";
import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js";
import * as template from "../core/template.js";
import AriaListMixin from "./AriaListMixin.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import * as internal from "./internal.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import KeyboardPagedSelectionMixin from "./KeyboardPagedSelectionMixin.js";
import KeyboardPrefixSelectionMixin from "./KeyboardPrefixSelectionMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import MultiSelectionMixin from "./MultiSelectionMixin.js";
// import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SelectionInViewMixin from "./SelectionInViewMixin.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapSelectionMixin from "./TapSelectionMixin.js";
// import TapToggleMixin from "./TapToggleMixin.js";

const Base = AriaListMixin(
  ComposedFocusMixin(
    DirectionSelectionMixin(
      FocusVisibleMixin(
        //         FormElementMixin(
        ItemsTextMixin(
          KeyboardDirectionMixin(
            KeyboardMixin(
              KeyboardPagedSelectionMixin(
                KeyboardPrefixSelectionMixin(
                  LanguageDirectionMixin(
                    //                       SelectedItemTextValueMixin(
                    SelectionInViewMixin(
                      MultiSelectionMixin(
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

  // Pressing Space toggles selection on the active item.
  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    let handled;
    switch (event.key) {
      case " ": {
        const { selectedIndex } = this[internal.state];
        if (selectedIndex >= 0) {
          toggleItemSelection(this, selectedIndex);
        }
        break;
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  get orientation() {
    return this[internal.state].orientation;
  }
  set orientation(orientation) {
    this[internal.setState]({ orientation });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    if (this[internal.firstRender]) {
      // Let ARIA know this is a multi-select list box.
      this.setAttribute("aria-multiselectable", "true");
    }

    // Apply `active` style to the selected item only.
    if (changed.items || changed.selectedIndex) {
      const { selectedIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute("active", index === selectedIndex);
        });
      }
    }

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

  [internal.tap](/** @type {MouseEvent} */ event) {
    super[internal.tap](event);

    // In some situations, the event target will not be the child which was
    // originally clicked on. E.g., if the item clicked on is a button, the
    // event seems to be raised in phase 2 (AT_TARGET) — but the event target
    // will be the component, not the item that was clicked on. Instead of
    // using the event target, we get the first node in the event's composed
    // path.
    const target = event.composedPath ? event.composedPath()[0] : event.target;

    // Find which item was clicked on and, if found, select it. For elements
    // which don't require a selection, a background click will determine
    // the item was null, in which we case we'll remove the selection.
    const { items } = this[internal.state];
    if (items && target instanceof Node) {
      const targetIndex = indexOfItemContainingTarget(items, target);
      if (targetIndex >= 0) {
        toggleItemSelection(this, targetIndex);
      }
    }
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

function toggleItemSelection(element, itemIndex) {
  const { selectedIndices } = element[internal.state];
  const newIndices = [...selectedIndices];
  newIndices[itemIndex] = !newIndices[itemIndex];
  element[internal.setState]({
    selectedIndices: newIndices,
  });
}
export default MultiSelectListBox;
