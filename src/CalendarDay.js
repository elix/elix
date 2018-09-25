import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';
import CalendarElementMixin from './CalendarElementMixin.js';


const Base =
  CalendarElementMixin(
    ReactiveElement
  );


class CalendarDay extends Base {

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

    const { date, locale } = this.state;
    const today = calendar.today();
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const nextDate = calendar.offsetDateByDays(date, 1);
    const daysFromToday = Math.round(date.getTime() - today.getTime()) / calendar.millisecondsPerDay;
    const weekend = dayOfWeek === calendar.weekendStart(locale) ||
      dayOfWeek === calendar.weekendEnd(locale);

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
