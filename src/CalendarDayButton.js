import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Button from './Button.js';
import CalendarElementMixin from './CalendarElementMixin.js';


const Base =
  CalendarElementMixin(
    Button
  );


class CalendarDayButton extends Base {

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CalendarDayButton, symbols.template);
    const styleTemplate = template.html`
      <style>
        :host {
          display: inline-block;
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

        #inner {
          background: none;
          border: 1px solid transparent;
          display: block;
          padding: 0.3em;
          text-align: right;
        }

        :host(:hover) #inner {
          border-color: gray;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
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
        inner: {
          textContent: date.getDate()
        }
      }
    });
  }

}


export default CalendarDayButton;
customElements.define('elix-calendar-day-button', CalendarDayButton);
