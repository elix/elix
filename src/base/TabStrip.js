import { deepContains } from "../core/dom.js";
import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { defaultAriaRole } from "./accessibility.js";
import AriaListMixin from "./AriaListMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import {
  defaultState,
  keydown,
  render,
  rendered,
  setState,
  state,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

const Base = AriaListMixin(
  CursorAPIMixin(
    CursorSelectMixin(
      DirectionCursorMixin(
        ItemsAPIMixin(
          ItemsCursorMixin(
            KeyboardDirectionMixin(
              KeyboardMixin(
                LanguageDirectionMixin(
                  SingleSelectAPIMixin(
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
);

/**
 * Strip of tab buttons
 *
 * `TabStrip` is specifically responsible for handling keyboard navigation
 * between tab buttons, and for the visual layout of the buttons.
 *
 * The user can select a tab with the mouse or touch, as well as by through the
 * keyboard. Each tab appears as a separate button in the tab order.
 * Additionally, if the focus is currently on a tab, the user can quickly
 * navigate between tabs with the left/right arrow keys (or, if the tabs are
 * in vertical position, the up/down arrow keys).
 *
 * By default, the tabs are shown aligned to the left (in left-to-right
 * languages like English), where each tab is only as big as necessary. You
 * can adjust the alignment of the tabs with the `tabAlign` property.
 *
 * The component assumes that the tab buttons will appear above the tab panels
 * they control. You can adjust that positioning with the `position`
 * property.
 *
 * A `TabStrip` is often wrapped around a set of tab panels, a scenario which
 * can be handled with the separate [TabStripWrapper](TabStripWrapper)
 * component.
 *
 * @inherits ReactiveElement
 * @mixes AriaListMixin
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes DirectionCursorMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TapCursorMixin
 */
class TabStrip extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      orientation: "horizontal",
      position: "top",
      role: "tablist",
      tabAlign: "start",
      tabButtonRole: "tab",
      tabIndex: -1,
    });
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled;

    // Let user select a tab button with Enter or Space.
    // The button will generally raise a `click` event on Enter/Space, but our
    // use of `TapCursorMixin` listens to mousedown, not click, so we handle the
    // keys specially.
    switch (event.key) {
      /* eslint-disable no-case-declarations */
      case " ":
      case "Enter":
        const { items, currentIndex } = this[state];
        if (event.target instanceof HTMLElement) {
          const newIndex = items && items.indexOf(event.target);
          this[setState]({
            currentIndex: newIndex,
          });
          handled = newIndex !== currentIndex;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event)) || false;
  }

  // TabStrip orientation depends on position property.
  get orientation() {
    return this[state].orientation;
  }

  /**
   * The position of the tab strip with respect to the associated tab panels.
   *
   * Setting this property does not actually change the tab strip's position in
   * the document, but works as a signal to the contained tab buttons as to how
   * they should present themselves. The standard [TabButton](TabButton) uses
   * this information, for example, to remove the visible border between the tab
   * button and its associated panel.
   *
   * @type {('bottom'|'left'|'right'|'top')}
   * @default 'top'
   */
  get position() {
    return this[state].position;
  }
  set position(position) {
    const orientation =
      position === "top" || position === "bottom" ? "horizontal" : "vertical";
    this[setState]({
      orientation,
      position,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    const { items } = this[state];
    if (changed.items && items) {
      const { tabButtonRole } = this[state];
      items.forEach((item) => {
        if (tabButtonRole === defaultAriaRole[item.localName]) {
          item.removeAttribute("role");
        } else {
          item.setAttribute("role", tabButtonRole);
        }
      });
    }

    if ((changed.items || changed.currentIndex) && items) {
      // Apply `selected` style to the selected item only.
      const { currentIndex } = this[state];
      items.forEach((item, index) => {
        item.toggleAttribute("selected", index === currentIndex);
      });
    }

    if (changed.orientation) {
      this.style.gridAutoFlow =
        this[state].orientation === "vertical" ? "row" : "column";
    }

    if (changed.tabAlign) {
      const { tabAlign } = this[state];
      const justifyContentForTabAlign = {
        center: "center",
        end: "end",
        start: "start",
        stretch: "stretch", // No style needed for "stretch"
      };
      // @ts-ignore
      this.style.placeContent = justifyContentForTabAlign[tabAlign];
    }

    if (changed.items || changed.position) {
      const { position } = this[state];
      if (items) {
        items.forEach((item) => {
          if ("position" in item) {
            /** @type {any} */ (item).position = position;
          }
        });
      }
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    // Does this component, or any of its assigned nodes, have focus?
    // This is a surprisingly hard question to answer.
    // Try finding the deepest active element, then walking up.
    let focused = false;
    let activeElement = document.activeElement;
    if (activeElement) {
      while (
        activeElement.shadowRoot &&
        activeElement.shadowRoot.activeElement
      ) {
        activeElement = activeElement.shadowRoot.activeElement;
      }
      focused = deepContains(this, activeElement);
    }

    // Ensure the selected tab button has the focus.
    const selectedItem = this.selectedItem;
    if (
      focused &&
      selectedItem &&
      selectedItem instanceof HTMLElement &&
      selectedItem !== document.activeElement
    ) {
      selectedItem.focus();
    }
  }

  /**
   * The alignment of the tabs within the tab strip.
   *
   * @type {('start'|'center'|'end'|'stretch')}
   * @default 'start'
   */
  get tabAlign() {
    return this[state].tabAlign;
  }
  set tabAlign(tabAlign) {
    this[setState]({ tabAlign });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-grid;
          grid-auto-flow: column;
        }
      </style>
      <slot></slot>
    `;
  }
}

export default TabStrip;
