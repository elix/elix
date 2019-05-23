import { applyChildNodes } from './utilities.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarDay from './CalendarDay.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';


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
  dayElementForDate(date) {
    const days = this.days || [];
    return days.find(day => calendar.datesEqual(day.date, date));
  }

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
    const state = Object.assign(super.defaultState, {
      date: calendar.today(),
      dayCount: 1,
      dayRole: CalendarDay,
      days: null,
      showCompleteWeeks: false,
      showSelectedDay: false,
      startDate: today
    });

    // If any date-related state changes, regenerate the set of days.
    state.onChange(['dayCount', 'dayRole', 'locale', 'showCompleteWeeks', 'startDate'], (state, changed) => {
      const days = updateDays(state, changed.dayRole);
      return { days };
    });

    return state;
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.days) {
      applyChildNodes(this.$.dayContainer, this.state.days);
    }
    if (changed.date || changed.showSelectedDay) {
      // Ensure only current date has "selected" class.
      const showSelectedDay = this.state.showSelectedDay;
      const { date } = this.state;
      const selectedDate = date.getDate();
      const selectedMonth = date.getMonth();
      const selectedYear = date.getFullYear();
      const days = this.days || [];
      days.forEach(day => {
        if ('selected' in day) {
          const dayDate = day.date;
          const selected = showSelectedDay &&
            dayDate.getDate() === selectedDate &&
            dayDate.getMonth() === selectedMonth &&
            dayDate.getFullYear() === selectedYear;
          day.selected = selected;
        }
      });
    }
    if (changed.dayCount || changed.startDate) {
      // Mark dates as inside or outside of range.
      const { dayCount, startDate } = this.state;
      const firstDateAfterRange = calendar.offsetDateByDays(startDate, dayCount);
      const days = this.state.days || [];
      days.forEach(day => {
        if ('outsideRange' in day) {
          const dayDate = day.date;
          const dayTime = dayDate.getTime();
          const outsideRange = dayTime < startDate.getTime() ||
            dayTime >= firstDateAfterRange.getTime();
          day.outsideRange = outsideRange;
        }
      });
    }
  }

  get showCompleteWeeks() {
    return this.state.showCompleteWeeks;
  }
  set showCompleteWeeks(showCompleteWeeks) {
    this.setState({
      showCompleteWeeks
    });
  }

  get showSelectedDay() {
    return this.state.showSelectedDay;
  }
  set showSelectedDay(showSelectedDay) {
    this.setState({
      showSelectedDay
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
          direction: ltr;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
      </style>

      <div id="dayContainer"></div>
    `;
  }

}


// Create days as necessary for the given state.
// Reuse existing day elements to the degree possible.
function updateDays(state, forceCreation) {
  const { dayCount, dayRole, locale, showCompleteWeeks, startDate } = state;
  const workingStartDate = showCompleteWeeks ?
    calendar.firstDateOfWeek(startDate, locale) :
    calendar.midnightOnDate(startDate);
  let workingDayCount;
  if (showCompleteWeeks) {
    const endDate = calendar.offsetDateByDays(startDate, dayCount - 1);
    const workingEndDate = calendar.lastDateOfWeek(endDate, locale);
    workingDayCount = calendar.daysBetweenDates(workingStartDate, workingEndDate) + 1;
  } else {
    workingDayCount = dayCount;
  }

  let days = state.days ? state.days.slice() : [];

  let date = workingStartDate;
  for (let i = 0; i < workingDayCount; i++) {
    const createNewElement = forceCreation || i >= days.length;
    const day = createNewElement ?
      template.createElement(dayRole) :
      days[i];
    day.date = new Date(date.getTime());
    day.locale = locale;
    day.style.gridColumnStart = '';
    if (createNewElement) {
      days[i] = day;
    }
    date = calendar.offsetDateByDays(date, 1);
  }

  if (workingDayCount < days.length) {
    // Trim days which are no longer needed.
    days = days.slice(0, workingDayCount);
  }

  const firstDay = days[0];
  if (firstDay && !showCompleteWeeks) {
    // Set the grid-column on the first day. This will cause all the subsequent
    // days to line up in the calendar grid.
    const dayOfWeek = calendar.daysSinceFirstDayOfWeek(firstDay.date, state.locale);
    firstDay.style.gridColumnStart = dayOfWeek + 1;
  }

  Object.freeze(days);
  return days;
}


export default CalendarDays;
customElements.define('elix-calendar-days', CalendarDays);
