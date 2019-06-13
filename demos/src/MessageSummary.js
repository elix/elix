import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';


export default class MessageSummary extends ReactiveElement {

  get date() {
    return this.state.date;
  }
  set date(date) {
    this.setState({
      date
    });
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      date: null,
      read: false,
      sender: null,
      summary: null
    });
  }

  get read() {
    return this.state.read;
  }
  set read(read) {
    const parsed = String(read) === 'true';
    this.setState({
      read: parsed
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.date) {
      this.$.date.textContent = this.state.date;
    }
    if (changed.read) {
      this.classList.toggle('read', this.state.read);
    }
    if (changed.sender) {
      this.$.sender.textContent = this.state.sender;
    }
    if (changed.summary) {
      this.$.summary.textContent = this.state.summary;
    }
  }

  get sender() {
    return this.state.sender;
  }
  set sender(sender) {
    this.setState({
      sender
    });
  }

  get summary() {
    return this.state.summary;
  }
  set summary(summary) {
    this.setState({
      summary
    });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: grid;
          grid-gap: 3px;
          grid-template-columns: 1fr auto;
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
          height: 2.4em;
          overflow: hidden;
        }
      </style>
      <div id="sender"></div>
      <div id="date"></div>
      <div id="summary"></div>
      <div id="body">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('message-summary', MessageSummary);
