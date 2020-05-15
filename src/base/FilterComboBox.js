import AutoCompleteComboBox from "./AutoCompleteComboBox.js";
import { substantiveElements } from "./content.js";
import FilterListBox from "./FilterListBox.js";
import {
  defaultState,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  stateEffects,
} from "./internal.js";
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
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      filter: "",
      listPartType: FilterListBox,
      texts: null,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (changed.inputPartType) {
      this[ids].input.addEventListener("input", (event) => {
        this[raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        const filter = cast.detail
          ? cast.detail.originalText
          : this[state].value;
        this[setState]({ filter });
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.filter || changed.currentIndex) {
      const { filter, currentIndex } = this[state];
      if (filter === "" || currentIndex === -1) {
        const list = /** @type {any} */ (this[ids].list);
        if ("filter" in list) {
          list.filter = filter;
        }
      }
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

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
