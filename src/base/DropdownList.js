import { replaceChildNodes } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import FormElementMixin from "./FormElementMixin.js";
import html from "../core/html.js";
import MenuButton from "./MenuButton.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = FormElementMixin(
  SelectedItemTextValueMixin(SingleSelectionMixin(SlotItemsMixin(MenuButton)))
);

/**
 * Shows a single choice made from a pop-up list of choices
 *
 * @inherits MenuButton
 * @mixes FormElementMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @part {div} value - region inside the toggle button showing the value of the current selection
 */
class DropdownList extends Base {
  // By default, opening the menu re-selects the component item that's currently
  // selected.
  get defaultMenuSelectedIndex() {
    return this[internal.state].selectedIndex;
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      itemRole: "menuitemradio",
      selectionRequired: true,
      valuePartType: "div"
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);

    if (changed.valuePartType) {
      template.transmute(
        this[internal.ids].value,
        this[internal.state].valuePartType
      );
    }

    if (changed.itemRole) {
      if ("itemRole" in this[internal.ids].menu) {
        /** @type {any} */ (this[internal.ids].menu).itemRole = this[
          internal.state
        ].itemRole;
      }
    }

    if (changed.selectedIndex) {
      const items = this[internal.state].items || [];
      const selectedItem = items[this[internal.state].selectedIndex];
      const clone = selectedItem ? selectedItem.cloneNode(true) : null;
      const childNodes = clone ? clone.childNodes : [];
      replaceChildNodes(this[internal.ids].value, childNodes);
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // When the menu closes, update our selection from the menu selection.
    if (changed.opened) {
      const { closeResult, items, opened } = state;
      if (!opened && items && closeResult !== undefined) {
        const selectedIndex = items.indexOf(closeResult);
        Object.assign(effects, { selectedIndex });
      }
    }

    return effects;
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Replace the source slot with an element to show the value.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      template.replace(
        sourceSlot,
        html`
          <div id="value" part="value"></div>
        `
      );
    }

    return result;
  }

  /**
   * The class, tag, or template used to create the `value` part - the region
   * showing the dropdown list's current value.
   *
   * @type {PartDescriptor}
   * @default 'div'
   */
  get valuePartType() {
    return this[internal.state].valuePartType;
  }
  set valuePartType(valuePartType) {
    this[internal.setState]({ valuePartType });
  }
}

export default DropdownList;
