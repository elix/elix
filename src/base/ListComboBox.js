import { forwardFocus } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { transmute } from "../core/template.js";
import ComboBox from "./ComboBox.js";
import { getDefaultText } from "./content.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import DelegateCursorMixin from "./DelegateCursorMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import {
  defaultState,
  getItemText,
  goFirst,
  goLast,
  goNext,
  goPrevious,
  ids,
  itemsDelegate,
  keydown,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ListBox from "./ListBox.js";
import PopupSelectMixin from "./PopupSelectMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

const Base = CursorAPIMixin(
  DelegateCursorMixin(
    DelegateItemsMixin(PopupSelectMixin(SingleSelectAPIMixin(ComboBox)))
  )
);

/**
 * A combo box whose popup presents a list of choices
 *
 * @inherits ComboBox
 * @mixes CursorAPIMixin
 * @mixes DelegateCursorMixin
 * @mixes DelegateItemsMixin
 * @mixes PopupSelectMixin
 * @mixes SingleSelectAPIMixin
 * @part {ListBox} list - the list of choices
 */
class ListComboBox extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentIndex: -1,
      horizontalAlign: "stretch",
      listPartType: ListBox,
      selectedIndex: -1,
      selectedItem: null,
    });
  }

  /**
   * Extract the text from the given item.
   *
   * The default implementation returns an item's `aria-label`, `alt` attribute,
   * or its `textContent`, in that order. You can override this to return the
   * text that should be used.
   *
   * @param {ListItemElement} item
   * @returns {string}
   */
  [getItemText](item) {
    return getDefaultText(item);
  }

  // We do our own handling of the Up and Down arrow keys, rather than relying
  // on KeyboardDirectionMixin. The latter supports Home and End, and we don't
  // want to handle those -- we want to let the text input handle them.
  // We also need to forward PageDown/PageUp to the list element.
  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled;
    /** @type {any} */
    const list = this[ids].list;

    switch (event.key) {
      case "ArrowDown":
        if (this.opened) {
          handled = event.altKey ? this[goLast]() : this[goNext]();
        }
        break;

      case "ArrowUp":
        if (this.opened) {
          handled = event.altKey ? this[goFirst]() : this[goPrevious]();
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

    // If the list's current index changed as a result of a keyboard operation,
    // update the selected index. We distinguish between keyboard operations
    // (which update both cursor and selection) and mouse hover operations
    // (which update the cursor, but not the selection).
    if (handled) {
      const { selectedIndex } = this[state];
      if (selectedIndex !== list.currentIndex) {
        this[setState]({
          selectedIndex: list.currentIndex,
        });
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  /**
   * The class or tag used to create the `list` part - the list of
   * available choices shown in the popup.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get listPartType() {
    return this[state].listPartType;
  }
  set listPartType(listPartType) {
    this[setState]({ listPartType });
  }

  get [itemsDelegate]() {
    return this[ids].list;
  }

  [render](/** @type {ChangedFlags} */ changed) {
    if (changed.listPartType && this[ids].list) {
      // Turn off focus handling for old list.
      /** @type {any} */
      const cast = this[ids].list;
      forwardFocus(cast, null);
    }

    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.listPartType) {
      // Keep focus off of the list and on the top level combo box (which should
      // delegate focus to the input).
      /** @type {any} */
      const cast = this[ids].list;
      forwardFocus(cast, this);
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    // Indicate which component is the popup's list.
    if (changed.listPartType) {
      this[setState]({
        popupList: this[ids].list,
      });
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // We want the cursor to track the selection, but we don't always want the
    // selection to track the cursor. (A mouse hover operation on the list will
    // update the cursor, but shouldn't update the selection.) For that reason,
    // we can't use the CursorSelectMixin, which updates in both directions.
    if (changed.selectedIndex) {
      Object.assign(effects, {
        currentIndex: state.selectedIndex,
      });
    }
    if (changed.selectedItem) {
      Object.assign(effects, {
        currentItem: state.selectedItem,
      });
    }

    // If value was changed directly or items have updated, select the
    // corresponding item in list.
    if (changed.items || changed.value) {
      const { value } = state;
      /** @type {ListItemElement[]} */ const items = state.items;
      if (items && value != null) {
        const searchText = value.toLowerCase();
        const currentIndex = items.findIndex((item) => {
          const itemText = this[getItemText](item);
          return itemText.toLowerCase() === searchText;
        });
        Object.assign(effects, { currentIndex });
      }
    }

    // If user selects a new item, make the item's text the value.
    if (changed.selectedIndex) {
      const { items, selectedIndex, value } = state;
      const currentItem = items ? items[selectedIndex] : null;
      const currentItemText = currentItem ? this[getItemText](currentItem) : "";
      // See notes on mobile at ComboBox.defaultState.
      const probablyMobile = matchMedia("(pointer: coarse)").matches;
      const selectText = !probablyMobile;
      if (value !== currentItemText) {
        Object.assign(effects, {
          selectText,
          value: currentItemText,
        });
      }
    }

    // If closing, make current item the selected item.
    if (changed.opened) {
      const { closeResult, currentIndex, opened } = state;
      const closing = changed.opened && !opened;
      const canceled = closeResult && closeResult.canceled;
      if (closing && !canceled && currentIndex >= 0) {
        Object.assign(effects, {
          selectedIndex: currentIndex,
        });
      }
    }

    // When items change, we need to recalculate popup size.
    if (changed.items) {
      Object.assign(effects, {
        popupMeasured: false,
      });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    // Wrap default slot with a list.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
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

    renderParts(result.content, this[state]);

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
      transmute(list, listPartType);
    }
  }
}

export default ListComboBox;
