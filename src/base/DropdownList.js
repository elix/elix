import { updateChildNodes } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { replace, transmute } from "../core/template.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import {
  defaultState,
  ids,
  render,
  rendered,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import PopupButton from "./PopupButton.js";
import PopupSelectMixin from "./PopupSelectMixin.js";
import SelectedTextAPIMixin from "./SelectedTextAPIMixin.js";
import SelectedValueAPIMixin from "./SelectedValueAPIMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = CursorAPIMixin(
  DelegateInputLabelMixin(
    FormElementMixin(
      ItemsAPIMixin(
        ItemsCursorMixin(
          PopupSelectMixin(
            SelectedTextAPIMixin(
              SelectedValueAPIMixin(
                SingleSelectAPIMixin(SlotItemsMixin(PopupButton))
              )
            )
          )
        )
      )
    )
  )
);

/**
 * Shows a single choice made from a pop-up list of choices
 *
 * @inherits PopupButton
 * @mixes CursorAPIMixin
 * @mixes DelegateInputLabelMixin
 * @mixes FormElementMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes PopupSelectMixin
 * @mixes SelectedTextAPIMixin
 * @mixes SelectedValueAPIMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 *
 * @part {div} list - the list shown in the popup
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 * @part {div} value - region inside the toggle button showing the value of the current selection
 */
class DropdownList extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      accessibleOptions: null,
      ariaHasPopup: "listbox",
      listPartType: "div",
      selectedIndex: -1,
      selectedItem: null,
      valuePartType: "div",
    });
  }

  get items() {
    /** @type {any} */
    const list = this[ids] && this[ids].list;
    return list ? list.items : null;
  }

  /**
   * The class or tag used to define the `list` part – the element
   * presenting the list items and handling navigation between them.
   *
   * @type {PartDescriptor}
   * @default List
   */
  get listPartType() {
    return this[state].listPartType;
  }
  set listPartType(listPartType) {
    this[setState]({ listPartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

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

    if (changed.sourcePartType) {
      /** @type {any} */ const source = this[ids].source;
      // HACK — need better way to forward button role to inner button.
      if (source.inner) {
        source.inner.setAttribute("role", "none");
      }
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

    // Create accessible items for dropdown list.
    if (changed.items) {
      const items = state.items || [];
      const accessibleOptions = items.map((item) => {
        const option = document.createElement("option");
        option.textContent = item.textContent; // TODO getItemText
        return option;
      });
      Object.assign(effects, { accessibleOptions });
    }

    // When opening the popup, by default (re)select the current item.
    if (changed.opened && state.opened) {
      Object.assign(effects, {
        currentIndex: state.selectedIndex,
      });
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

    // If we get items while closed and don't have a selection, select the first
    // item.
    if (changed.items || changed.selectedIndex) {
      const { items, opened, selectedIndex } = state;
      if (!opened && selectedIndex < 0 && items && items.length > 0) {
        Object.assign(effects, {
          selectedIndex: 0,
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

    // Wrap default slot with a list.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <div id="list" part="list">
          <slot></slot>
        </div>
      `);
    }

    // Apply combobox semantics to the source button. Because focus moves to the
    // list itself when the popup opens, the aria-controls attribute has no
    // effect other than convincing the browser to announce the button as a
    // combobox.
    const source = result.content.querySelector('[part~="source"]');
    if (source) {
      source.setAttribute("aria-activedescendant", "value");
      source.setAttribute("aria-autocomplete", "none");
      source.setAttribute("aria-controls", "list");
      source.setAttribute("role", "combobox");
    }

    renderParts(result.content, this[state]);

    result.content.append(fragmentFrom.html`
      <style>
        [part~="list"] {
          max-height: 100%;
        }
      </style>
    `);

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
  if (!changed || changed.listPartType) {
    const { listPartType } = state;
    const list = root.getElementById("list");
    if (list) {
      transmute(list, listPartType);
    }
  }
  if (!changed || changed.valuePartType) {
    const { valuePartType } = state;
    const value = root.getElementById("value");
    if (value) {
      transmute(value, valuePartType);
    }
  }
}

export default DropdownList;
