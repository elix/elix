import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


class CalendarWeek extends ReactiveElement {

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

  /// TODO: role for calendar day
  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: table-row;
        }

        :host > :not(style) {
          display: table-cell;
          width: 14.285%; /* One seventh */
        }
      </style>

      <div id="day0" class="day firstDayOfWeek"></div>
      <div id="day1" class="day"></div>
      <div id="day2" class="day"></div>
      <div id="day3" class="day"></div>
      <div id="day4" class="day"></div>
      <div id="day5" class="day"></div>
      <div id="day6" class="day lastDayOfWeek"></div>
    `;
  }

  get updates() {
    const referenceDate = this.state.date;
    const referenceYear = referenceDate.getFullYear();
    const referenceMonth = referenceDate.getMonth();
    const dateStart = calendar.firstDateOfWeek(referenceDate, this.state.locale);
    const dayUpdates = {};
    for (let i = 0; i <= 6; i++) {
      const date = calendar.offsetDateByDays(dateStart, i);
      // Apply inside/outside month styles to days that fall outside of the
      // month of the reference date for this week.
      const insideMonth = date.getFullYear() === referenceYear &&
          date.getMonth() === referenceMonth;
      dayUpdates[`day${i}`] = {
        classes: {
          insideMonth,
          outsideMonth: !insideMonth
        },
        textContent: date.getDate()
      };
    }

    return merge(super.updates, {
      $: dayUpdates
    });
  }

}


export default CalendarWeek;
customElements.define('elix-calendar-week', CalendarWeek);
