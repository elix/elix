import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
    ReactiveElement
  );


/**
 * Calendar representation of a single day.
 * 
 * [A default representation of the current day in browser's default locale](/demos/calendarDay.html)
 * 
 * Given a reference `date` property, this component will show a calendar
 * representation of that date.
 * 
 * [CalendarDays](CalendarDays), and [CalendarMonth](CalendarMonth) instantiate
 * `CalendarDay` as the default component for rendering days.
  * 
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
* 
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 */
class CalendarDay extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      date: calendar.today(),
      outsideRange: false,
      selected: false
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    const classList = this.classList;
    const { date } = this.state;
    if (changed.date) {
      const today = calendar.today();
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();
      const nextDate = calendar.offsetDateByDays(date, 1);
      const daysFromToday = Math.round(date.getTime() - today.getTime()) / calendar.millisecondsPerDay;
      classList.toggle('alternateMonth', Math.abs(date.getMonth() - today.getMonth()) % 2 === 1);
      classList.toggle('firstDayOfMonth', dayOfMonth === 1);
      classList.toggle('firstWeek', dayOfMonth <= 7);
      classList.toggle('future', date > today);
      classList.toggle('lastDayOfMonth', date.getMonth() !== nextDate.getMonth());
      classList.toggle('past', date < today);
      classList.toggle('saturday', dayOfWeek === 6);
      classList.toggle('sunday', dayOfWeek === 0);
      classList.toggle('today', daysFromToday == 0);
      this.$.day.textContent = dayOfMonth.toString();
    }
    if (changed.date || changed.locale) {
      const dayOfWeek = date.getDay();
      const { locale } = this.state;
      const weekend = dayOfWeek === calendar.weekendStart(locale) ||
        dayOfWeek === calendar.weekendEnd(locale);
      classList.toggle('weekday', !weekend);
      classList.toggle('weekend', weekend);
    }
    if (changed.outsideRange) {
      classList.toggle('outsideRange', this.state.outsideRange);
    }
    if (changed.selected) {
      classList.toggle('selected', this.state.selected);
    }
  }

  get outsideRange() {
    return this.state.outsideRange;
  }
  set outsideRange(outsideRange) {
    this.setState({
      outsideRange
    });
  }

  get selected() {
    return this.state.selected;
  }
  set selected(selected) {
    this.setState({
      selected
    });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          padding: 0.3em;
        }

        :host(.weekend) {
          color: gray;
        }

        :host(.outsideRange) {
          color: lightgray;
        }

        :host(.today) {
          color: darkred;
          font-weight: bold;
        }

        :host(.selected) {
          background: #ddd;
        }

        #day {
          display: block;
          text-align: right;
        }
      </style>

      <span id="day"></span>
    `;
  }

}


export default CalendarDay;
customElements.define('elix-calendar-day', CalendarDay);
