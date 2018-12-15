import { merge } from './updates.js';
import { stateChanged } from './utilities.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarDay from './CalendarDay.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';


const previousStateKey = Symbol('previousState');


const Base =
  CalendarElementMixin(
    ReactiveElement
  );

/**
 * A 7-column grid of days for use in a month calendar or multi-week calendar.
 * 
 * [A default representation of days in the current month in browser's default locale](/demos/calendarMonth.html)
 * 
 * Given a `startDate` and `dayCount`, this component will show a calendar
 * representation of that many days starting from the indicated date.
 * [CalendarMonth](CalendarMonth) uses `CalendarDays` to render the days portion
 * of the month, to which it adds headers for the month/year and the days of the
 * week.
 * 
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
 * 
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @elementrole {CalendarDay} day
 */
class CalendarDays extends Base {

  /**
   * Returns the day element corresponding to the given date, or null if the
   * date falls outside this calendar week.
   *
   * @param {Date} date - the date to search for
   */
  // dayElementForDate(date) {
  //   const locale = this.state.locale;
  //   const midnightOnDate = calendar.midnightOnDate(date);
  //   const firstDateOfWeek = calendar.firstDateOfWeek(this.date, locale);
  //   const firstDateOfNextWeek = calendar.offsetDateByDays(firstDateOfWeek, 7);
  //   if (midnightOnDate >= firstDateOfWeek && midnightOnDate < firstDateOfNextWeek) {
  //     const dayIndex = calendar.daysSinceFirstDayOfWeek(date, locale);
  //     const days = this.days;
  //     return days && days[dayIndex];
  //   } else {
  //     return null;
  //   }
  // }

  get dayCount() {
    return this.state.dayCount;
  }
  set dayCount(dayCount) {
    this.setState({
      dayCount
    });
  }

  /**
   * The class, tag, or template used for the seven days of the week.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default CalendarDay
   */
  get dayRole() {
    return this.state.dayRole;
  }
  set dayRole(dayRole) {
    this.setState({ dayRole });
  }

  get days() {
    return this.state.days;
  }

  get defaultState() {
    const today = calendar.today();
    return Object.assign({}, super.defaultState, {
      dayCount: 1,
      dayRole: CalendarDay,
      days: null,
      startDate: today
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      dayCount: null,
      dayRole: null,
      locale: null,
      startDate: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    if (changed.dayRole || changed.locale || changed.startDate || changed.dayCount) {
      updateDays(state, changed.dayRole);
      result = false;
    }
    return result;
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    const days = this.days || [];
    // Ensure only current date has "selected" class.
    const date = this.state.date;
    const referenceDate = date.getDate();
    const referenceMonth = date.getMonth();
    const referenceYear = date.getFullYear();
    days.forEach(day => {
      if ('selected' in day) {
        const dayDate = day.date;
        const selected = dayDate.getDate() === referenceDate &&
          dayDate.getMonth() === referenceMonth &&
          dayDate.getFullYear() === referenceYear;
        day.selected = selected;
      }
    });
  }

  get startDate() {
    return this.state.startDate;
  }
  set startDate(startDate) {
    const parsed = typeof startDate === 'string' ?
      new Date(startDate) :
      startDate;
    if (!calendar.datesEqual(this.state.startDate, parsed)) {
      this.setState({
        startDate: parsed
      });
    }
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }

        #dayContainer {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
      </style>

      <div id="dayContainer"></div>
    `;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        dayContainer: {
          childNodes: this.state.days
        }
      }
    });
  }

}


// Create days as necessary for the given state.
// Reuse existing day elements to the degree possible.
function updateDays(state, forceCreation) {
  const { dayCount, dayRole, locale } = state;
  const startDate = calendar.midnightOnDate(state.startDate);
  let days = state.days ? state.days.slice() : [];
  let date = startDate;
  for (let i = 0; i < dayCount; i++) {
    const createNewElement = forceCreation || i >= days.length;
    const day = createNewElement ?
      template.createElement(dayRole) :
      days[i];
    day.date = new Date(date.getTime());
    day.locale = locale;
    if (createNewElement) {
      days[i] = day;
    }
    date = calendar.offsetDateByDays(date, 1);
  }
  if (dayCount < days.length) {
    // Trim days which are no longer needed.
    days = days.slice(0, dayCount);
  }
  const firstDay = days[0];
  if (firstDay) {
    // Set the grid-column on the first day. This will cause all the subsequent
    // days to line up in the calendar grid.
    const dayOfWeek = calendar.daysSinceFirstDayOfWeek(firstDay.date, state.locale);
    firstDay.style.gridColumnStart = dayOfWeek + 1;
  }
  Object.freeze(days);
  state.days = days;
}


export default CalendarDays;
customElements.define('elix-calendar-days', CalendarDays);
