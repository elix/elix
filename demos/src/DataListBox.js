import * as internal from "../../src/base/internal.js";
import * as dom from "../../src/core/dom.js";
import * as template from "../../src/core/template.js";
import PlainListBox from "../../src/plain/PlainListBox.js";

class DataListBox extends PlainListBox {
  get data() {
    return this[internal.state].data;
  }
  set data(data) {
    this[internal.setState]({ data });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      data: null,
      itemPartType: "div",
      items: null,
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.items) {
      const slot = this[internal.ids].slot;
      if (slot) {
        const items = this[internal.state].items || [];
        dom.updateChildNodes(slot, items);
      }
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects]
      ? super[internal.stateEffects](state, changed)
      : {};

    if (changed.data) {
      const { data, itemPartType } = state;
      const items =
        data == null
          ? null
          : data.map((obj) => {
              const element = template.createElement(itemPartType);
              element.textContent = obj;
              return element;
            });
      Object.assign(effects, { items });
    }

    return effects;
  }

  get [internal.template]() {
    const result = super[internal.template];

    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.id = "slot";
      defaultSlot.name = uuidv4();
    }

    return result;
  }
}

// Generate a UUID
// https://stackoverflow.com/a/2117523/76472
function uuidv4() {
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export default DataListBox;
customElements.define("data-list-box", DataListBox);
