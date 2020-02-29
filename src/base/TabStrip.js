import { deepContains } from "../core/dom.js";
import { defaultAriaRole } from "./accessibility.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import AriaListMixin from "./AriaListMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapSelectionMixin from "./TapSelectionMixin.js";

const Base = AriaListMixin(
  TapSelectionMixin(
    DirectionSelectionMixin(
      KeyboardDirectionMixin(
        KeyboardMixin(
          LanguageDirectionMixin(
            SingleSelectionMixin(SlotItemsMixin(ReactiveElement))
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
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @mixes TapSelectionMixin
 */
class TabStrip extends Base {
  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);

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

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      orientation: "horizontal",
      role: "tablist",
      selectionRequired: true,
      tabAlign: "start",
      tabButtonRole: "tab",
      tabIndex: -1,
      position: "top"
    });
  }

  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    let handled;

    // Let user select a tab button with Enter or Space.
    switch (event.key) {
      /* eslint-disable no-case-declarations */
      case " ":
      case "Enter":
        const { items, selectedIndex } = this[internal.state];
        if (event.target instanceof HTMLElement) {
          const newIndex = items && items.indexOf(event.target);
          this[internal.setState]({
            selectedIndex: newIndex
          });
          handled = newIndex !== selectedIndex;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled ||
      (super[internal.keydown] && super[internal.keydown](event)) ||
      false
    );
  }

  // TabStrip orientation depends on position property.
  get orientation() {
    return this[internal.state].orientation;
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
    return this[internal.state].position;
  }
  set position(position) {
    const orientation =
      position === "top" || position === "bottom" ? "horizontal" : "vertical";
    this[internal.setState]({
      orientation,
      position
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    const { items } = this[internal.state];
    if (changed.items && items) {
      const { tabButtonRole } = this[internal.state];
      items.forEach(item => {
        if (tabButtonRole === defaultAriaRole[item.localName]) {
          item.removeAttribute("role");
        } else {
          item.setAttribute("role", tabButtonRole);
        }
      });
    }
    if ((changed.items || changed.selectedIndex) && items) {
      // Apply `selected` style to the selected item only.
      const { selectedIndex } = this[internal.state];
      items.forEach((item, index) => {
        item.toggleAttribute("selected", index === selectedIndex);
      });
    }
    if (changed.orientation) {
      this.style.gridAutoFlow =
        this[internal.state].orientation === "vertical" ? "row" : "column";
    }
    if (changed.tabAlign) {
      const { tabAlign } = this[internal.state];
      const justifyContentForTabAlign = {
        center: "center",
        end: "end",
        start: "start",
        stretch: "stretch" // No style needed for "stretch"
      };
      // @ts-ignore
      this.style.placeContent = justifyContentForTabAlign[tabAlign];
    }
    if (changed.items || changed.position) {
      const { position } = this[internal.state];
      if (items) {
        items.forEach(item => {
          if ("position" in item) {
            /** @type {any} */ (item).position = position;
          }
        });
      }
    }
  }

  /**
   * The alignment of the tabs within the tab strip.
   *
   * @type {('start'|'center'|'end'|'stretch')}
   * @default 'start'
   */
  get tabAlign() {
    return this[internal.state].tabAlign;
  }
  set tabAlign(tabAlign) {
    this[internal.setState]({ tabAlign });
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: grid;
          grid-auto-flow: column;
        }
      </style>
      <slot></slot>
    `;
  }
}

export default TabStrip;
