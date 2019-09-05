import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';


export default class MessageSummary extends ReactiveElement {

  get date() {
    return this[symbols.state].date;
  }
  set date(date) {
    this[symbols.setState]({
      date
    });
  }

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], {
      date: null,
      read: false,
      sender: null,
      summary: null
    });
  }

  get read() {
    return this[symbols.state].read;
  }
  set read(read) {
    const parsed = String(read) === 'true';
    this[symbols.setState]({
      read: parsed
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.date) {
      this.$.date.textContent = this[symbols.state].date;
    }
    if (changed.read) {
      this.classList.toggle('read', this[symbols.state].read);
    }
    if (changed.sender) {
      this.$.sender.textContent = this[symbols.state].sender;
    }
    if (changed.summary) {
      this.$.summary.textContent = this[symbols.state].summary;
    }
  }

  get sender() {
    return this[symbols.state].sender;
  }
  set sender(sender) {
    this[symbols.setState]({
      sender
    });
  }

  get summary() {
    return this[symbols.state].summary;
  }
  set summary(summary) {
    this[symbols.setState]({
      summary
    });
  }

  get [symbols.template]() {
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
