import * as internal from '../../src/internal.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';


export default class MessageSummary extends ReactiveElement {

  get date() {
    return this[internal.state].date;
  }
  set date(date) {
    this[internal.setState]({
      date
    });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      date: null,
      read: false,
      sender: null,
      summary: null
    });
  }

  get read() {
    return this[internal.state].read;
  }
  set read(read) {
    const parsed = String(read) === 'true';
    this[internal.setState]({
      read: parsed
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    if (changed.date) {
      this[internal.ids].date.textContent = this[internal.state].date;
    }
    if (changed.read) {
      this.classList.toggle('read', this[internal.state].read);
    }
    if (changed.sender) {
      this[internal.ids].sender.textContent = this[internal.state].sender;
    }
    if (changed.summary) {
      this[internal.ids].summary.textContent = this[internal.state].summary;
    }
  }

  get sender() {
    return this[internal.state].sender;
  }
  set sender(sender) {
    this[internal.setState]({
      sender
    });
  }

  get summary() {
    return this[internal.state].summary;
  }
  set summary(summary) {
    this[internal.setState]({
      summary
    });
  }

  get [internal.template]() {
    return template.html`
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


customElements.define('message-summary', MessageSummary);
