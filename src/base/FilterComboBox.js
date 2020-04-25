import AutoCompleteComboBox from "./AutoCompleteComboBox.js";
import { substantiveElements } from "./content.js";
import FilterListBox from "./FilterListBox.js";
import * as internal from "./internal.js";
import { getTextsFromItems } from "./ItemsTextMixin.js";
import SlotContentMixin from "./SlotContentMixin.js";

const Base = SlotContentMixin(AutoCompleteComboBox);

/**
 * A combo box which applies its text input as a filter on its list items
 *
 * @inherits AutoCompleteComboBox
 * @mixes SlotContentMixin
 * @part {FilterListBox} list
 */
class FilterComboBox extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      filter: "",
      listPartType: FilterListBox,
      texts: null,
    });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    if (changed.inputPartType) {
      this[internal.ids].input.addEventListener("input", (event) => {
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
        filter: "",
      });
    }

    return effects;
  }
}

export default FilterComboBox;
