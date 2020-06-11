import ComboBox from "./ComboBox.js";
import ListBox from "./ListBox.js";
import {
  defaultState,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  stateEffects,
} from "./internal.js";
import SlotContentMixin from "./SlotContentMixin.js";

const Base = SlotContentMixin(ComboBox);

/**
 * A combo box that behaves like an HTML select
 *
 * @inherits ComboBox
 * @mixes SlotContentMixin
 * @part {div} input
 * @part {Listbox} list
 */
class DropdownList extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      inputPartType: 'div',
      listPartType: ListBox,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (changed.inputPartType) {
      this[ids].input.addEventListener("input", (event) => {
        this[raiseChangeEvents] = true;
        /** @type {any} */
        // const cast = event;
        // const filter = cast.detail
        //   ? cast.detail.originalText
        //   : this[state].value;
        // this[setState]({ filter });
        this[raiseChangeEvents] = false;
      });
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    return effects;
  }
}

export default DropdownList;
