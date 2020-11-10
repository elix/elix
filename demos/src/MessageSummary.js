import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

export default class MessageSummary extends ReactiveElement {
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "read") {
      this.read = String(newValue) === "true";
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  get date() {
    return this[state].date;
  }
  set date(date) {
    this[setState]({ date });
  }

  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      date: null,
      read: false,
      sender: null,
      summary: null,
    });
  }

  get read() {
    return this[state].read;
  }
  set read(read) {
    this[setState]({ read });
  }

  [render](changed) {
    super[render](changed);
    if (changed.date) {
      this[ids].date.textContent = this[state].date;
    }
    if (changed.read) {
      this.classList.toggle("read", this[state].read);
    }
    if (changed.sender) {
      this[ids].sender.textContent = this[state].sender;
    }
    if (changed.summary) {
      this[ids].summary.textContent = this[state].summary;
    }
  }

  get sender() {
    return this[state].sender;
  }
  set sender(sender) {
    this[setState]({ sender });
  }

  get summary() {
    return this[state].summary;
  }
  set summary(summary) {
    this[setState]({ summary });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: flex;
        }

        #container {
          box-sizing: border-box;
          display: grid;
          flex: 1;
          gap: 1px;
          grid-template-columns: 1fr auto;
          margin: 0.5em 1em;
          overflow: hidden;
        }

        #summary,
        #body {
          grid-column: 1 / span 2;
        }

        #date,
        #body {
          color: gray;
        }

        :host(:not(.read)) #summary {
          font-weight: bold;
        }

        #body {
          height: 2.5em;
          overflow: hidden;
        }
      </style>
      <div id="container">
        <div id="sender"></div>
        <div id="date"></div>
        <div id="summary"></div>
        <div id="body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define("message-summary", MessageSummary);
