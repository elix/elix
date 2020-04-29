import * as internal from "../../src/base/internal.js";
import * as dom from "../../src/core/dom.js";
import html from "../../src/core/html.js";
import * as template from "../../src/core/template.js";
import PlainListBox from "../../src/plain/PlainListBox.js";

class DataListBox extends PlainListBox {
  get data() {
    return this[internal.state].data;
  }
  set data(data) {
    this[internal.setState]({ data });
  }

  get dataItemAdapter() {
    return this[internal.state].dataItemAdapter;
  }
  set dataItemAdapter(dataItemAdapter) {
    this[internal.setState]({ dataItemAdapter });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      data: null,
      dataItemAdapter: defaultDataItemAdapter,
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

    if (changed.data || changed.dataItemAdapter || changed.itemPartType) {
      const { data, dataItemAdapter, itemPartType } = state;
      const items =
        data == null
          ? null
          : data.map((entry) => {
              const element = template.createElement(itemPartType);
              dataItemAdapter(entry, element);
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
      defaultSlot.replaceWith(html`<div id="slot"></div>`);
    }

    result.content.append(html`
      <style>
        #slot {
          display: contents;
        }
      </style>
    `);

    return result;
  }
}

function defaultDataItemAdapter(data, item) {
  item.textContent = data.toString();
}

export default DataListBox;
customElements.define("data-list-box", DataListBox);
