import * as dom from "../../src/core/dom.js";
import * as internal from "../../src/base/internal.js";
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
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.data) {
      // const defaultSlot = this[internal.shadowRoot].querySelector(
      //   "slot:not([name])"
      // );
      // if (defaultSlot) {
      const data = this[internal.state].data || [];
      const { itemPartType } = this[internal.state];
      const items = data.map((obj) => {
        const element = template.createElement(itemPartType);
        element.textContent = obj;
        return element;
      });
      // dom.updateChildNodes(defaultSlot, items);
      dom.updateChildNodes(this, items);
      // }
    }
  }
}

export default DataListBox;
customElements.define("data-list-box", DataListBox);
