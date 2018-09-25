import './CalendarMonthDays.js';
import './CalendarMonthYearHeader.js';
import './CalendarWeekDaysHeader.js';
import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


class CalendarMonth extends ReactiveElement {

  get date() {
    return this.state.date;
  }
  set date(date) {
    this.setState({ date });
  }

  get days() {
    return this.shadowRoot ?
      this.$.monthDays.days :
      null;
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

  // TODO: roles
  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }

        #monthYearHeader {
          display: block;
        }

        #monthTable {
          border-collapse: collapse;
          display: table;
          width: 100%;
        }

        #weekDaysHeader {
          display: table-header-group;
        }
      </style>

      <elix-calendar-month-year-header id="monthYearHeader"></elix-calendar-month-year-header>
      <div id="monthTable">
        <elix-calendar-week-days-header id="weekDaysHeader" format="short"></elix-calendar-week-days-header>
        <elix-calendar-month-days id="monthDays"></elix-calendar-month-days>
      </div>
    `;
  }

  get updates() {
    const { date, locale } = this.state;
    return merge(super.updates, {
      $: {
        monthDays: {
          date,
          locale
        },
        monthYearHeader: {
          date,
          locale
        },
        weekDaysHeader: {
          locale
        }
      }
    });
  }

}


export default CalendarMonth;
customElements.define('elix-calendar-month', CalendarMonth);
