import { merge } from './updates.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarDay from './CalendarDay.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import CalendarWeek from './CalendarWeek.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
    ReactiveElement
  );


/**
 * The days of a single calendar month, optimized for a given locale.
 * 
 * [A default representation of days in the current month in browser's default locale](/demos/calendarMonthDays.html)
 * 
 * Given a reference `date` property, this component will show a calendar
 * representation of the days of that month. [CalendarMonth](CalendarMonth) uses
 * `CalendarMonthDays` to render the days portion of the month, to which it adds
 * headers for the month/year and the days of the week.
 * 
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
 * 
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @elementrole {CalendarDay} day
 * @elementrole {CalendarWeek} week
 */
class CalendarMonthDays extends Base {

  constructor() {
    super();
    // The template already includes CalendarWeek in the week role.
    this[symbols.renderedRoles] = {
      weekRole: CalendarWeek
    };
  }

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].weekRole !== this.state.weekRole) {
      const weeks = this.weeks;
      if (weeks) {
        template.transmute(weeks, this.state.weekRole);
      }
      this[symbols.renderedRoles].weekRole = this.state.weekRole;
    }
  }

  /**
   * Returns the day element corresponding to the given date, or null if the
   * date falls outside the range currently covered by this calendar.
   *
   * @param {Date} date - the date to search for
   * @returns {Element|null}
   */
  dayElementForDate(date) {
    /** @type {any} */
    const week = this.weekElementForDate(date);
    return week && 'dayElementForDate' in week &&
      week.dayElementForDate(date);
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
    const weeks = this.weeks;
    if (!weeks) {
      return null;
    }
    const weeksDays = weeks.map(week => {
      /** @type {any} */
      const cast = week;
      return cast.days;
    });
    return [].concat(...weeksDays);
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dayRole: CalendarDay,
      weekRole: CalendarWeek
    });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: table-row-group;
        }

        .week.outsideMonth {
          display: none;
        }
      </style>

      <elix-calendar-week id="week0" class="week"></elix-calendar-week>
      <elix-calendar-week id="week1" class="week"></elix-calendar-week>
      <elix-calendar-week id="week2" class="week"></elix-calendar-week>
      <elix-calendar-week id="week3" class="week"></elix-calendar-week>
      <elix-calendar-week id="week4" class="week"></elix-calendar-week>
      <elix-calendar-week id="week5" class="week"></elix-calendar-week>
    `;
  }

  get updates() {
    const { dayRole, locale } = this.state;
    const firstDateOfMonth = calendar.firstDateOfMonth(this.state.date);
    const month = firstDateOfMonth.getMonth();
    const weekUpdates = {};
    for (let i = 0; i <= 5; i++) {
      const referenceDate = calendar.offsetDateByDays(firstDateOfMonth, 7 * i);
      // For the first week of the month, use the first of the month as the
      // reference date of that week. For subsequent weeks, use the first of
      // the given week.
      const firstDateOfWeek = calendar.firstDateOfWeek(referenceDate, locale);
      const date = (i === 0)
        ? referenceDate
        : firstDateOfWeek;
      // Hide weeks completely in another month (i.e., the next month).
      // Apply "hidden" class to preserve week's original "display" property.
      const lastDateOfWeek = calendar.offsetDateByDays(firstDateOfWeek, 6);
      const outsideMonth = !(firstDateOfWeek.getMonth() === month || lastDateOfWeek.getMonth() === month);
      weekUpdates[`week${i}`] = {
        classes: {
          outsideMonth
        },
        date,
        dayRole,
        locale,
        outsideMonth
      };
    }

    return merge(super.updates, {
      $: weekUpdates
    });
  }

  /**
   * Returns the week element for the week containing the given date.
   *
   * @param {Date} date - the date to search for
   * @returns {Element|null}
   */
  weekElementForDate(date) {
    const monthDate = this.state.date;
    const locale = this.state.locale;
    if (calendar.sameMonthAndYear(monthDate, date)) {
      const firstDateOfMonth = calendar.firstDateOfMonth(monthDate);
      const offset = calendar.daysSinceFirstDayOfWeek(firstDateOfMonth, locale);
      const weekIndex = Math.floor((date.getDate() + offset - 1) / 7);
      const weeks = this.weeks;
      return weeks && weeks[weekIndex];
    } else {
      return null;
    }
  }

  /**
   * The class, tag, or template used for the weeks of the month.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default CalendarWeek
   */
  get weekRole() {
    return this.state.weekRole;
  }
  set weekRole(weekRole) {
    this.setState({ weekRole });
  }

  /**
   * Returns the set of week elements used by the calendar.
   * 
   * @type {Element[]}
   */
  get weeks() {
    return this.shadowRoot ?
      [
        this.$.week0,
        this.$.week1,
        this.$.week2,
        this.$.week3,
        this.$.week4,
        this.$.week5
      ] :
      null;
  }

}


export default CalendarMonthDays;
customElements.define('elix-calendar-month-days', CalendarMonthDays);
