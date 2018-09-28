import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
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

  /**
   * The date of the first day in the month.
   *
   * Note that there may be days from the previous month that appear (or are
   * hidden) before this first day of the month.
   *
   * @property firstDateOfMonth
   */
  get firstDateOfMonth() {
    const date = calendar.midnightOnDate(this.date);
    date.setDate(1);
    return date;
  }

  /**
   * Returns true if the given date is in the month shown.
   *
   * @param date
   */
  isDateInMonth(date) {
    const firstDateOfNextMonth = calendar.offsetDateByDays(this.lastDateOfMonth, 1);
    return (date >= this.firstDateOfMonth && date < firstDateOfNextMonth);
  }

  /**
   * The date of the last day in the month.
   *
   * Note that there may be days from the next month that appear (or are hidden)
   * after this last day of the month.
   *
   * @property lastDateOfMonth
   */
  get lastDateOfMonth() {
    // Get last day of month by going to first day of next month and backing up a day.
    const date = this.firstDateOfMonth;
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);
    return date;
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
    const firstDateOfMonth = this.firstDateOfMonth;
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
