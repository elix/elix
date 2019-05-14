import './CalendarDayNamesHeader.js';
import './CalendarDays.js';
import './CalendarMonthYearHeader.js';
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
   * The class, tag, or template used to create the day elements.
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
    return this.shadowRoot ?
      /** @type {any} */ (this.$.monthDays).days :
      [];
  }

  /**
   * The format used to render the day names in the week days header.
   * 
   * The allowable formats are the same as the `weekday` formats in
   * [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).
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
    return Object.assign(super.defaultState, {
      date: calendar.today(),
      dayRole: CalendarDay,
      daysOfWeekFormat: 'short',
      monthFormat: 'long',
      showCompleteWeeks: false,
      showSelectedDay: false,
      yearFormat: 'numeric'
    });
  }

  /**
   * The format used to render the month name.
   * 
   * The allowable formats are the same as the `month` formats in
   * [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).
   * 
   * @type {('numeric'|'2-digit'|'long'|'short'|'narrow')}
   * @default 'long'
   */
  get monthFormat() {
    return this.state.monthFormat;
  }
  set monthFormat(monthFormat) {
    this.setState({
      monthFormat
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.locale) {
      const locale = this.state.locale;
      /** @type {any} */ (this.$.monthDays).locale = locale;
      /** @type {any} */ (this.$.monthYearHeader).locale = locale;
      /** @type {any} */ (this.$.weekDaysHeader).locale = locale;
    }
    if (changed.dayRole) {
      /** @type {any} */ (this.$.monthDays).dayRole = this.state.dayRole;
    }
    if (changed.date) {
      const { date } = this.state;
      if (date) {
        const startDate = calendar.firstDateOfMonth(date);
        const endDate = calendar.lastDateOfMonth(date);
        const dayCount = endDate.getDate();
        Object.assign(this.$.monthDays, {
          date,
          dayCount,
          startDate
        });
        /** @type {any} */ (this.$.monthYearHeader).date = calendar.firstDateOfMonth(date);
      }
    }
    if (changed.daysOfWeekFormat) {
      const { daysOfWeekFormat } = this.state;
      /** @type {any} */ (this.$.weekDaysHeader).format = daysOfWeekFormat;
    }
    if (changed.showCompleteWeeks) {
      const { showCompleteWeeks } = this.state;
      /** @type {any} */ (this.$.monthDays).showCompleteWeeks = showCompleteWeeks;
    }
    if (changed.showSelectedDay) {
      const { showSelectedDay } = this.state;
      /** @type {any} */ (this.$.monthDays).showSelectedDay = showSelectedDay;
    }
    if (changed.monthFormat) {
      const { monthFormat } = this.state;
      /** @type {any} */ (this.$.monthYearHeader).monthFormat = monthFormat;
    }
    if (changed.yearFormat) {
      const { yearFormat } = this.state;
      /** @type {any} */ (this.$.monthYearHeader).yearFormat = yearFormat;
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

        #weekDaysHeader {
          font-size: smaller;
          width: 100%;
        }

        #monthDays {
          display: block;
        }
      </style>

      <elix-calendar-month-year-header id="monthYearHeader"></elix-calendar-month-year-header>
      <elix-calendar-day-names-header id="weekDaysHeader" format="short"></elix-calendar-day-names-header>
      <elix-calendar-days id="monthDays"></elix-calendar-days>
    `;
  }

  /**
   * The format used to render the year.
   * 
   * The allowable formats are the same as the `year` formats in
   * [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).
   * 
   * @type {('numeric'|'2-digit')}
   * @default 'numeric'
   */
  get yearFormat() {
    return this.state.yearFormat;
  }
  set yearFormat(yearFormat) {
    this.setState({
      yearFormat
    });
  }

}


export default CalendarMonth;
customElements.define('elix-calendar-month', CalendarMonth);
