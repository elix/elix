import DataItemsMixin from "../../src/base/DataItemsMixin.js";
import {
  ids,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import * as dom from "../../src/core/dom.js";
import html from "../../src/core/html.js";
import PlainListBox from "../../src/plain/PlainListBox.js";

class DataListBox extends DataItemsMixin(PlainListBox) {
  get data() {
    return this[state].data;
  }
  set data(data) {
    this[setState]({ data });
  }

  [render](changed) {
    super[render](changed);

    if (changed.items) {
      const slot = this[ids].slot;
      if (slot) {
        const items = this[state].items || [];
        dom.updateChildNodes(slot, items);
      }
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    if (changed.data && this[raiseChangeEvents]) {
      /**
       * Raised when the `data` property changes.
       *
       * @event data-changed
       */
      const event = new CustomEvent("data-changed", {
        bubbles: true,
      });
      this.dispatchEvent(event);
    }
  }

  get [template]() {
    const result = super[template];

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

export default DataListBox;
customElements.define("data-list-box", DataListBox);
