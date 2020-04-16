import * as dom from "../../src/core/dom.js";
import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import html from "../../src/core/html.js";
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
      const container = this[internal.ids].container;
      if (container) {
        const items = this[internal.state].items || [];
        dom.updateChildNodes(container, items);
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

    result.content.append(html`
      <style>
        #container > * {
          padding: 0.25em;
        }

        #container > [selected] {
          background: highlight;
          color: highlighttext;
        }

        @media (pointer: coarse) {
          #container > * {
            padding: 1em;
          }
        }
      </style>
    `);

    return result;
  }
}

export default DataListBox;
customElements.define("data-list-box", DataListBox);
