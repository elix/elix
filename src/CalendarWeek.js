import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import CalendarDay from './CalendarDay.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
    ReactiveElement
  );


/**
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @elementrole {CalendarDay} day
 */
class CalendarWeek extends Base {

  constructor() {
    super();
    this[symbols.roles] = Object.assign({}, this[symbols.roles], {
      day: CalendarDay
    });
  }

  /**
   * The class, tag, or template used for the seven days of the week.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default CalendarDay
   */
  get dayRole() {
    return this[symbols.roles].day;
  }
  set dayRole(dayRole) {
    this[symbols.hasDynamicTemplate] = true;
    this[symbols.roles].day = dayRole;
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
      outsideMonth: false
    });
  }

  get outsideMonth() {
    return this.state.outsideMonth;
  }
  set outsideMonth(outsideMonth) {
    this.setState({ outsideMonth });
  }

  /// TODO: role for calendar day
  get [symbols.template]() {
    const result = template.html`
      <style>
        :host {
          display: table-row;
        }

        .day {
          display: table-cell;
          width: 14.285%; /* One seventh */
        }
      </style>

      <div id="day0" class="day firstDayOfWeek"></div>
      <div id="day1" class="day"></div>
      <div id="day2" class="day"></div>
      <div id="day3" class="day"></div>
      <div id="day4" class="day"></div>
      <div id="day5" class="day"></div>
      <div id="day6" class="day lastDayOfWeek"></div>
    `;
    template.findAndReplace(result, '.day', this.dayRole);
    return result;
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
