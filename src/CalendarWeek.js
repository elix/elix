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
 * Calendar representation of a single week
 * 
 * [A default representation of the current week in browser's default locale](/demos/calendarWeek.html)
 * 
 * Given a reference `date` property, this component will show a week of days
 * that includes the referenced date.
 * 
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
 *
 * The first day of the week is sensitive to the current `locale`. For example,
 * a `CalendarWeek` in the U.S. will show a Sunday as the first day of the week,
 * but in the U.K. will show a Monday as the first day. The day(s) associated
 * with the weekend in that locale will also be indicated.
 * 
 * [CalendarMonth](CalendarMonth) and [CalendarMonthDays](CalendarMonthDays)
 * instantiate `CalendarWeek` as the default component for rendering the weeks
 * of a month.
 * 
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @elementrole {CalendarDay} day
 */
class CalendarWeek extends Base {

  constructor() {
    super();
    // The template already includes CalendarDay in the day role.
    this[symbols.renderedRoles] = {
      dayRole: CalendarDay
    };
  }

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].dayRole !== this.state.dayRole) {
      const days = this.days;
      if (days) {
        template.transmute(days, this.state.dayRole);
      }
      this[symbols.renderedRoles].dayRole = this.state.dayRole;
    }
  }

  /**
   * Returns the day element corresponding to the given date, or null if the
   * date falls outside this calendar week.
   *
   * @param {Date} date - the date to search for
   */
  dayElementForDate(date) {
    const locale = this.state.locale;
    const midnightOnDate = calendar.midnightOnDate(date);
    const firstDateOfWeek = calendar.firstDateOfWeek(this.date, locale);
    const firstDateOfNextWeek = calendar.offsetDateByDays(firstDateOfWeek, 7);
    if (midnightOnDate >= firstDateOfWeek && midnightOnDate < firstDateOfNextWeek) {
      const dayIndex = calendar.daysSinceFirstDayOfWeek(date, locale);
      const days = this.days;
      return days && days[dayIndex];
    } else {
      return null;
    }
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
    return this.shadowRoot ?
      [
        this.$.day0,
        this.$.day1,
        this.$.day2,
        this.$.day3,
        this.$.day4,
        this.$.day5,
        this.$.day6
      ] :
      null;
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dayRole: CalendarDay,
      outsideMonth: false
    });
  }

  get outsideMonth() {
    return this.state.outsideMonth;
  }
  set outsideMonth(outsideMonth) {
    this.setState({ outsideMonth });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: table-row;
        }

        .day {
          display: table-cell;
          width: 14.285%; /* One seventh */
        }
      </style>

      <elix-calendar-day id="day0" class="day firstDayOfWeek"></elix-calendar-day>
      <elix-calendar-day id="day1" class="day"></elix-calendar-day>
      <elix-calendar-day id="day2" class="day"></elix-calendar-day>
      <elix-calendar-day id="day3" class="day"></elix-calendar-day>
      <elix-calendar-day id="day4" class="day"></elix-calendar-day>
      <elix-calendar-day id="day5" class="day"></elix-calendar-day>
      <elix-calendar-day id="day6" class="day lastDayOfWeek"></elix-calendar-day>
    `;
  }

  get updates() {
    const referenceDate = this.state.date;
    const locale = this.state.locale;
    const referenceYear = referenceDate.getFullYear();
    const referenceMonth = referenceDate.getMonth();
    const dateStart = calendar.firstDateOfWeek(referenceDate, this.state.locale);
    const dayUpdates = {};
    for (let i = 0; i <= 6; i++) {
      const date = calendar.offsetDateByDays(dateStart, i);
      // Apply inside/outside month styles to days that fall outside of the
      // month of the reference date for this week.
      const outsideMonth = this.state.outsideMonth ||
        !(date.getFullYear() === referenceYear && date.getMonth() === referenceMonth);
      dayUpdates[`day${i}`] = {
        classes: {
          insideMonth: !outsideMonth,
          outsideMonth
        },
        date,
        locale
      };
    }

    return merge(super.updates, {
      $: dayUpdates
    });
  }

}


export default CalendarWeek;
customElements.define('elix-calendar-week', CalendarWeek);
