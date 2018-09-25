import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


class CalendarMonthYearHeader extends ReactiveElement {

  get date() {
    return this.state.date;
  }
  set date(date) {
    this.setState({ date });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      date: new Date,
      locale: navigator.language
    });
  }

  get locale() {
    return this.state.locale;
  }
  set locale(locale) {
    this.setState({ locale });
  }

  get [symbols.template]() {
    // TODO: RTL
    return template.html`
      <style>
        :host {
          display: inline-block;
        }

        #formatted {
          text-align: center;
        }
      </style>
      <div id="formatted"></div>
    `;
  }

  get updates() {
    const formatter = new Intl.DateTimeFormat(this.state.locale, {
      month: 'long',
      year: 'numeric'
    });
    const textContent = formatter.format(this.state.date);
    return merge(super.updates, {
      $: {
        formatted: {
          textContent
        }
      }
    });
  }}

export default CalendarMonthYearHeader;
customElements.define('elix-calendar-month-year-header', CalendarMonthYearHeader);
