import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


class CalendarDay extends ReactiveElement {

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

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          padding: 0.3em;
        }

        :host(.today) {
          color: darkred;
          font-weight: bold;
        }

        :host(.outsideMonth) {
          visibility: hidden;
        }

        :host(.weekend) {
          color: gray;
        }

        #day {
          display: block;
          text-align: right;
        }
      </style>

      <span id="day"></span>
    `;
  }

  get updates() {
    const date = this.state.date;

    var today = calendar.today();
    var dayOfWeek = date.getDay();
    var dayOfMonth = date.getDate();
    var nextDate = calendar.offsetDateByDays(date, 1);
    var daysFromToday = Math.round(date.getTime() - today.getTime()) / calendar.millisecondsPerDay;
    // TODO: Respect locale weekend
    var weekend = (dayOfWeek === 0 || dayOfWeek === 6);

    return merge(super.updates, {
      classes: {
        alternateMonth: Math.abs(date.getMonth() - today.getMonth()) % 2 === 1,
        firstDayOfMonth: dayOfMonth === 1,
        firstWeek: dayOfMonth <= 7,
        future: date > today,
        lastDayOfMonth: date.getMonth() !== nextDate.getMonth(),
        past: date < today,
        saturday: dayOfWeek === 6,
        sunday: dayOfWeek === 0,
        today: daysFromToday == 0,
        weekday: !weekend,
        weekend: weekend
      },
      $: {
        day: {
          textContent: date.getDate()
        }
      }
    });
  }

}


export default CalendarDay;
customElements.define('elix-calendar-day', CalendarDay);
