import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


class CalendarWeekDaysHeader extends ReactiveElement {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      format: 'short',
      locale: navigator.language
    });
  }

  get format() {
    return this.state.format;
  }
  set format(format) {
    this.setState({ format });
  }

  get locale() {
    return this.state.locale;
  }
  set locale(locale) {
    this.setState({ locale });
  }

  // TODO: Role for day of week
  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: table-row;
        }

        .dayOfWeek {
          display: table-cell;
          width: 14.285%; /* One seventh */
        }

        /* TODO: Move to separate component? */
        .dayOfWeek {
          padding: 0.3em;
          text-align: center;
        }
      </style>

      <div id="day0" class="dayOfWeek"></div>
      <div id="day1" class="dayOfWeek"></div>
      <div id="day2" class="dayOfWeek"></div>
      <div id="day3" class="dayOfWeek"></div>
      <div id="day4" class="dayOfWeek"></div>
      <div id="day5" class="dayOfWeek"></div>
      <div id="day6" class="dayOfWeek"></div>
    `;
  }

  get updates() {
    const locale = this.state.locale;

    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: this.state.format
    });
    const date = new Date(2017, 0, 1); // A Sunday

    const firstDayOfWeek = calendar.firstDayOfWeek(locale);

    const dayUpdates = {};
    for (let i = 0; i <= 6; i++) {
      const dayOfWeek = (firstDayOfWeek + i) % 7;
      date.setDate(dayOfWeek + 1);
      dayUpdates[`day${i}`] = {
        textContent: formatter.format(date)
      };
    }

    return merge(super.updates, {
      $: dayUpdates
    });
  }

}


export default CalendarWeekDaysHeader;
customElements.define('elix-calendar-week-days-header', CalendarWeekDaysHeader);
