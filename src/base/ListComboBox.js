import { getItemText } from "./ItemsTextMixin.js";
import { indexOfItemContainingTarget, forwardFocus } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ComboBox from "./ComboBox.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import html from "../core/html.js";
import ListBox from "./ListBox.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";

const Base = DelegateItemsMixin(
  DirectionSelectionMixin(SingleSelectionMixin(ComboBox))
);

/**
 * A combo box whose popup presents a list of choices
 *
 * @inherits ComboBox
 * @mixes DelegateItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes SingleSelectionMixin
 * @part {ListBox} list - the list of choices
 */
class ListComboBox extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      horizontalAlign: "stretch",
      listPartType: ListBox,
      selectedIndex: -1
    });
  }

  // We do our own handling of the Up and Down arrow keys, rather than relying
  // on KeyboardDirectionMixin. The latter supports Home and End, and we don't
  // want to handle those -- we want to let the text input handle them.
  // We also need to forward PageDown/PageUp to the list element.
  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    let handled;
    /** @type {any} */
    const list = this[internal.ids].list;

    switch (event.key) {
      case "ArrowDown":
        if (this.opened) {
          handled = event.altKey
            ? this[internal.goEnd]()
            : this[internal.goDown]();
        }
        break;

      case "ArrowUp":
        if (this.opened) {
          handled = event.altKey
            ? this[internal.goStart]()
            : this[internal.goUp]();
        }
        break;

      case "PageDown":
        if (this.opened) {
          handled = list.pageDown && list.pageDown();
        }
        break;

      case "PageUp":
        if (this.opened) {
          handled = list.pageUp && list.pageUp();
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  /**
   * The class or tag used to create the `list` part - the list of
   * available choices shown in the popup.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get listPartType() {
    return this[internal.state].listPartType;
  }
  set listPartType(listPartType) {
    this[internal.setState]({ listPartType });
  }

  get [internal.itemsDelegate]() {
    return this[internal.ids].list;
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    if (changed.listPartType && this[internal.ids].list) {
      // Turn off focus handling for old list.
      /** @type {any} */
      const cast = this[internal.ids].list;
      forwardFocus(cast, null);
    }

    super[internal.render](changed);

    renderParts(this[internal.shadowRoot], this[internal.state], changed);

    if (this[internal.firstRender]) {
      this.setAttribute("aria-haspopup", "listbox");
    }

    if (changed.inputPartType) {
      this[internal.ids].input.setAttribute("aria-autocomplete", "both");
    }

    if (changed.listPartType) {
      this[internal.ids].list.addEventListener("mousedown", event => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        // Mousing down inside a list item closes the popup.
        /** @type {any} */
        const target = event.target;
        if (target) {
          const targetIndex = indexOfItemContainingTarget(this.items, target);
          if (this.opened && targetIndex >= 0) {
            this[internal.raiseChangeEvents] = true;
            this.close();
            this[internal.raiseChangeEvents] = false;
          }
        }
      });

      // Keep focus off of the list and on the top level combo box (which should
      // delegate focus to the input).
      /** @type {any} */
      const cast = this[internal.ids].list;
      forwardFocus(cast, this);

      // Track changes in the list's selection state.
      // Known bug: this behavior seems to confuse Gboard on Chrome for Android.
      // If we update our notion of the selection index, we'll ultimately update
      // the text shown in the input and leave it selected. If the user then
      // presses Backspace to delete that selected text, Gboard/Chrome seems to
      // ignore the first press of the Backspace key. The user must press
      // Backspace a second time to actually delete the selected text.
      this[internal.ids].list.addEventListener(
        "selected-index-changed",
        event => {
          /** @type {any} */
          const cast = event;
          const listSelectedIndex = cast.detail.selectedIndex;
          if (this[internal.state].selectedIndex !== listSelectedIndex) {
            this[internal.raiseChangeEvents] = true;
            this[internal.setState]({
              selectedIndex: listSelectedIndex
            });
            this[internal.raiseChangeEvents] = false;
          }
        }
      );
    }

    if (changed.selectedIndex) {
      const list = /** @type {any} */ (this[internal.ids].list);
      if ("selectedIndex" in list) {
        list.selectedIndex = this[internal.state].selectedIndex;
      }
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // If value was changed directly or items have updated, select the
    // corresponding item in list.
    if (changed.items || changed.value) {
      const { value } = state;
      /** @type {ListItemElement[]} */ const items = state.items;
      if (items && value != null) {
        const searchText = value.toLowerCase();
        const selectedIndex = items.findIndex(item => {
          const itemText = getItemText(item);
          return itemText.toLowerCase() === searchText;
        });
        Object.assign(effects, { selectedIndex });
      }
    }

    // If user selects a new item, or combo is closing, make selected item the
    // value.
    if (changed.opened || changed.selectedIndex) {
      const { closeResult, items, opened, selectedIndex, value } = state;
      const closing = changed.opened && !opened;
      const canceled = closeResult && closeResult.canceled;
      if (
        selectedIndex >= 0 &&
        (changed.selectedIndex || (closing && !canceled))
      ) {
        const selectedItem = items[selectedIndex];
        if (selectedItem) {
          const selectedItemText = getItemText(selectedItem);
          // See notes on mobile at ComboBox.defaultState.
          const probablyMobile = matchMedia("(pointer: coarse)").matches;
          const selectText = !probablyMobile;
          if (value !== selectedItemText) {
            Object.assign(effects, {
              selectText,
              value: selectedItemText
            });
          }
        }
      }
    }

    // When items change, we need to recalculate popup size.
    if (changed.items) {
      Object.assign(effects, {
        popupMeasured: false
      });
    }

    return effects;
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Wrap default slot with a list.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(html`
        <style>
          [part~="list"] {
            border: none;
            flex: 1;
            height: 100%;
            max-height: 100%;
            overscroll-behavior: contain;
            width: 100%;
          }
        </style>
        <div id="list" part="list" tabindex="-1">
          <slot></slot>
        </div>
      `);
    }

    renderParts(result.content, this[internal.state]);

    return result;
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.listPartType) {
    const { listPartType } = state;
    const list = root.getElementById("list");
    if (list) {
      template.transmute(list, listPartType);
    }
  }
}

export default ListComboBox;
