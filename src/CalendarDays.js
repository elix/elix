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
 * TODO: Docs
 * 
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @elementrole {CalendarDay} day
 */
class CalendarDays extends Base {

  constructor() {
    super();
    // The template already includes CalendarDay in the day role.
    this[symbols.renderedRoles] = {
      // dayRole: CalendarDay
    };
  }

  // [symbols.beforeUpdate]() {
  //   if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
  //   if (this[symbols.renderedRoles].dayRole !== this.state.dayRole) {
  //     const days = this.days;
  //     if (days) {
  //       template.transmute(days, this.state.dayRole);
  //     }
  //     this[symbols.renderedRoles].dayRole = this.state.dayRole;
  //   }
  // }

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
      dayRole: CalendarDay,
      days: null,
      startDate: today,
      endDate: today
    });
  }

  get endDate() {
    return this.state.endDate;
  }
  set endDate(endDate) {
    const parsed = typeof endDate === 'string' ?
      new Date(endDate) :
      endDate;
    if (this.state.endDate.getTime() !== endDate.getTime()) {
      this.setState({
        endDate: parsed
      });
    }
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      dayRole: null,
      startDate: null,
      endDate: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    if (changed.dayRole || changed.startDate || changed.endDate) {
      // Create new day elements.
      const days = createDays(state);
      Object.freeze(days);
      Object.assign(state, {
        days
      });
      result = false;
    }
    return result;
  }

  get startDate() {
    return this.state.startDate;
  }
  set startDate(startDate) {
    const parsed = typeof startDate === 'string' ?
      new Date(startDate) :
      startDate;
    if (this.state.startDate.getTime() !== startDate.getTime()) {
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

  get updates() {
    // const referenceDate = this.state.date;
    // const locale = this.state.locale;
    // const referenceYear = referenceDate.getFullYear();
    // const referenceMonth = referenceDate.getMonth();
    // const dateStart = calendar.firstDateOfWeek(referenceDate, this.state.locale);
    // const dayUpdates = {};
    // for (let i = 0; i <= 6; i++) {
    //   const date = calendar.offsetDateByDays(dateStart, i);
    //   // Apply inside/outside month styles to days that fall outside of the
    //   // month of the reference date for this week.
    //   const outsideMonth = this.state.outsideMonth ||
    //     !(date.getFullYear() === referenceYear && date.getMonth() === referenceMonth);
    //   dayUpdates[`day${i}`] = {
    //     classes: {
    //       insideMonth: !outsideMonth,
    //       outsideMonth
    //     },
    //     date,
    //     locale
    //   };
    // }

    return merge(super.updates, {
      $: {
        dayContainer: {
          childNodes: this.state.days
        }
      }
    });
  }

}


function createDays(state) {
  const { dayRole, locale } = state;
  const startDate = calendar.midnightOnDate(state.startDate);
  const endDate = calendar.midnightOnDate(state.endDate);
  const days = [];
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const day = template.createElement(dayRole);
    day.date = new Date(date.getTime());
    day.locale = locale;
    days.push(day);
  }
  const firstDay = days[0];
  if (firstDay) {
    // Set the grid-column on the first day. This will cause all the subsequent
    // days to line up in the calendar grid.
    const dayOfWeek = calendar.daysSinceFirstDayOfWeek(firstDay.date, state.locale);
    firstDay.style.gridColumn = dayOfWeek + 1;
  }
  return days;
}


export default CalendarDays;
customElements.define('elix-calendar-days', CalendarDays);
