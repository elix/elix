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
import { fragmentFrom } from "../../src/core/htmlLiterals.js";
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
      const oldEvent = new CustomEvent("data-changed", {
        bubbles: true,
      });
      this.dispatchEvent(oldEvent);
      /**
       * Raised when the `data` property changes.
       *
       * @event datachange
       */
      const event = new CustomEvent("datachange", {
        bubbles: true,
      });
      this.dispatchEvent(event);
    }
  }

  get [template]() {
    const result = super[template];

    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`<div id="slot"></div>`);
    }

    result.content.append(fragmentFrom.html`
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
