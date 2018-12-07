import './CalendarDayNamesHeader.js';
import './CalendarDays.js';
import './CalendarMonthYearHeader.js';
import { merge } from './updates.js';
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
 * A single calendar month, optimized for a given locale
 * 
 * [A default representation for the current month in browser's default locale](/demos/calendarMonth.html)
 * 
 * Given a reference `date` property, this component will show a calendar
 * representation of that month. To the extent possible, this representation is
 * sensitive to a specified locale: the names of the months and days of the week
 * will be in the appropriate language, and the day(s) associated with the
 * weekend in that locale will also be indicated.
 * 
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @elementrole {CalendarDay} day
 */
class CalendarMonth extends Base {

  /**
   * Returns the day element corresponding to the given date, or null if the
   * date falls outside the range currently covered by this calendar.
   *
   * @param {Date} date - the date to search for
   * @returns {Element|null}
   */
  dayElementForDate(date) {
    /** @type {any} */
    const monthDays = this.$.monthDays;
    return monthDays && 'dayElementForDate' in monthDays &&
      monthDays.dayElementForDate(date);
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

  /**
   * Returns the day elements contained by this calendar. Note that this may
   * include days from the previous/next month that fall in the same week as
   * the first/last day of the present month.
   * 
   * @type {Element[]}
   */
  get days() {
    if (!this.shadowRoot) {
      return [];
    }
    /** @type {any} */
    const cast = this.$.monthDays;
    return cast.days;
  }

  /**
   * The format used to render the day names in the week days header.
   * 
   * @type {('long'|'narrow'|'short')}
   * @default 'short'
   */
  get daysOfWeekFormat() {
    return this.state.daysOfWeekFormat;
  }
  set daysOfWeekFormat(daysOfWeekFormat) {
    this.setState({ daysOfWeekFormat });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dayRole: CalendarDay,
      daysOfWeekFormat: 'short'
    });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }

        #monthYearHeader {
          display: block;
          font-size: larger;
          font-weight: bold;
          padding: 0.3em;
        }

        #monthTable {
          border-collapse: collapse;
          display: table;
          width: 100%;
        }

        #weekDaysHeader {
          display: table-header-group;
          font-size: smaller;
        }

        #monthDays {
          display: block;
        }
      </style>

      <elix-calendar-month-year-header id="monthYearHeader"></elix-calendar-month-year-header>
      <div id="monthTable">
        <elix-calendar-day-names-header id="weekDaysHeader" format="short"></elix-calendar-day-names-header>
      </div>
      <elix-calendar-days id="monthDays"></elix-calendar-days>
    `;
  }

  get updates() {
    const {
      date,
      dayRole,
      daysOfWeekFormat,
      locale
    } = this.state;
    const startDate = calendar.firstDateOfMonth(date);
    const endDate = calendar.lastDateOfMonth(date);
    return merge(super.updates, {
      $: {
        monthDays: {
          date,
          dayRole,
          endDate,
          locale,
          startDate
        },
        monthYearHeader: {
          date,
          locale
        },
        weekDaysHeader: {
          format: daysOfWeekFormat,
          locale
        }
      }
    });
  }

}


export default CalendarMonth;
customElements.define('elix-calendar-month', CalendarMonth);
