import { getTextsFromItems } from "./ItemsTextMixin.js";
import { substantiveElements } from "./content.js";
import * as internal from "./internal.js";
import AutoCompleteInput from "./AutoCompleteInput.js";
import FilterListBox from "./FilterListBox.js";
import ListComboBox from "./ListComboBox.js";
import SlotContentMixin from "./SlotContentMixin.js";

const Base = SlotContentMixin(ListComboBox);

/**
 * A combo box which applies its text input as a filter on its list items
 *
 * @inherits ListComboBox
 * @mixes SlotContentMixin
 * @part {AutoCompleteInput} input
 * @part {FilterListBox} list
 */
class FilterComboBox extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      filter: "",
      inputPartType: AutoCompleteInput,
      listPartType: FilterListBox,
      texts: null
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.inputPartType) {
      this[internal.ids].input.addEventListener("input", event => {
        this[internal.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        const filter = cast.detail
          ? cast.detail.originalText
          : this[internal.state].value;
        this[internal.setState]({ filter });
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.filter || changed.selectedIndex) {
      const { filter, selectedIndex } = this[internal.state];
      if (filter === "" || selectedIndex === -1) {
        const list = /** @type {any} */ (this[internal.ids].list);
        if ("filter" in list) {
          list.filter = filter;
        }
      }
    }
    if (changed.texts) {
      const input = /** @type {any} */ (this[internal.ids].input);
      if ("texts" in input) {
        input.texts = this[internal.state].texts;
      }
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // If content changes, regenerate texts.
    if (changed.content) {
      const { content } = state;
      const items = content ? substantiveElements(content) : null;
      const texts = items ? getTextsFromItems(items) : [];
      Object.assign(effects, { texts });
    }

    // Closing resets the filter.
    if (changed.opened && !state.opened) {
      Object.assign(effects, {
        filter: ""
      });
    }

    return effects;
  }
}

export default FilterComboBox;
