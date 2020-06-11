import { defaultState, ids, render, state } from "./internal.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import ListComboBox from "./ListComboBox.js";

const Base = ItemsTextMixin(ListComboBox);

/**
 * A combo box that auto-completes the user's input against the list items
 *
 * @inherits ListComboBox
 * @mixes ItemsTextMixin
 * @part { div } input
 */
class DropdownList extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      inputPartType: 'div',
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.texts) {
      if ("texts" in this[ids].input) {
        /** @type {any} */ (this[ids].input).texts = this[state].texts;
      }
    }
  }
}

export default DropdownList;