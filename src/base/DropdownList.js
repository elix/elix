import { updateChildNodes } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { replace, transmute } from "../core/template.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import {
  defaultState,
  ids,
  render,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import MenuButton from "./MenuButton.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = CursorAPIMixin(
  FormElementMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        SelectedItemTextValueMixin(
          SingleSelectAPIMixin(SlotItemsMixin(MenuButton))
        )
      )
    )
  )
);

/**
 * Shows a single choice made from a pop-up list of choices
 *
 * @inherits MenuButton
 * @mixes FormElementMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @part {div} value - region inside the toggle button showing the value of the current selection
 */
class DropdownList extends Base {
  // By default, opening the menu re-selects the component item that's currently
  // selected.
  get defaultMenuItemIndex() {
    return this[state].selectedIndex;
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      itemRole: "menuitemradio",
      selectedIndex: -1,
      selectedItem: null,
      valuePartType: "div",
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.itemRole) {
      if ("itemRole" in this[ids].menu) {
        /** @type {any} */ (this[ids].menu).itemRole = this[state].itemRole;
      }
    }

    // Update selection.
    if (changed.items || changed.selectedIndex) {
      const { items, selectedIndex } = this[state];
      const selectedItem = items ? items[selectedIndex] : null;

      // Show selection in value part.
      const clone = selectedItem ? selectedItem.cloneNode(true) : null;
      const childNodes = clone ? clone.childNodes : [];
      updateChildNodes(this[ids].value, childNodes);

      // Mark only the selected item as selected.
      if (items) {
        items.forEach((/** @type {any} */ item) => {
          if ("selected" in item) {
            item.selected = item === selectedItem;
          }
        });
      }
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When the menu closes, update our selection from the menu selection.
    if (changed.opened) {
      const { closeResult, items, opened } = state;
      if (!opened && items && closeResult !== undefined) {
        const selectedIndex = items.indexOf(closeResult);
        Object.assign(effects, {
          selectedIndex,
        });
      }
    }

    // If we get items and don't have a selection, select the first item.
    if (changed.items || changed.selectedIndex) {
      const { items, selectedIndex } = state;
      if (selectedIndex < 0 && items && items.length > 0) {
        Object.assign(effects, {
          selectedIndex: 0,
        });
      }
    }

    // MenuButton sets menuSelectedIndex to -1 if the user isn't hovering
    // over the menu, but for the dropdown list pattern, we'd prefer to
    // default to showing the selected item.
    if (changed.menuSelectedIndex) {
      const { menuSelectedIndex, selectedIndex } = state;
      if (menuSelectedIndex === -1 && selectedIndex >= 0) {
        Object.assign(effects, {
          menuSelectedIndex: selectedIndex,
        });
      }
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    // Replace the source slot with an element to show the value.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      replace(
        sourceSlot,
        fragmentFrom.html` <div id="value" part="value"></div> `
      );
    }

    renderParts(result.content, this[state]);

    return result;
  }

  /**
   * The class or tag used to create the `value` part - the region
   * showing the dropdown list's current value.
   *
   * @type {PartDescriptor}
   * @default 'div'
   */
  get valuePartType() {
    return this[state].valuePartType;
  }
  set valuePartType(valuePartType) {
    this[setState]({ valuePartType });
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
  if (!changed || changed.valuePartType) {
    const { valuePartType } = state;
    const value = root.getElementById("value");
    if (value) {
      transmute(value, valuePartType);
    }
  }
}

export default DropdownList;
