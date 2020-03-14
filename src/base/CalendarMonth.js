import * as calendar from "./calendar.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import CalendarDay from "./CalendarDay.js";
import CalendarDayNamesHeader from "./CalendarDayNamesHeader.js";
import CalendarDays from "./CalendarDays.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import CalendarMonthYearHeader from "./CalendarMonthYearHeader.js";
import ReactiveElement from "../core/ReactiveElement.js";

const Base = CalendarElementMixin(ReactiveElement);

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
 * @part {CalendarDay} day - any of the day elements in the month grid
 * @part {CalendarDayNamesHeader} day-names-header - the column header showing the names of the days
 * @part {CalendarDays} month-days - the grid of days for the month
 * @part {CalendarMonthYearHeader} month-year-header - the calendar header showing the month and/or year
 * @part day-name - any of the names for the days of the week
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
    const monthDays = this[internal.ids].monthDays;
    return (
      monthDays &&
      "dayElementForDate" in monthDays &&
      monthDays.dayElementForDate(date)
    );
  }

  /**
   * The class or tag used to create the header showing the
   * day names.
   *
   * @type {PartDescriptor}
   * @default CalendarDayNamesHeader
   */
  get dayNamesHeaderPartType() {
    return this[internal.state].dayNamesHeaderPartType;
  }
  set dayNamesHeaderPartType(dayNamesHeaderPartType) {
    this[internal.setState]({ dayNamesHeaderPartType });
  }

  /**
   * The class or tag used to create the `day` parts – the set of
   * days shown in the calendar grid.
   *
   * @type {PartDescriptor}
   * @default CalendarDay
   */
  get dayPartType() {
    return this[internal.state].dayPartType;
  }
  set dayPartType(dayPartType) {
    this[internal.setState]({ dayPartType });
  }

  /**
   * Returns the day elements contained by this calendar. Note that this may
   * include days from the previous/next month that fall in the same week as
   * the first/last day of the present month.
   *
   * @type {Element[]}
   */
  get days() {
    return this[internal.shadowRoot]
      ? /** @type {any} */ (this[internal.ids].monthDays).days
      : [];
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
    return this[internal.state].daysOfWeekFormat;
  }
  set daysOfWeekFormat(daysOfWeekFormat) {
    this[internal.setState]({ daysOfWeekFormat });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      date: calendar.today(),
      dayNamesHeaderPartType: CalendarDayNamesHeader,
      dayPartType: CalendarDay,
      daysOfWeekFormat: "short",
      monthDaysPartType: CalendarDays,
      monthFormat: "long",
      monthYearHeaderPartType: CalendarMonthYearHeader,
      showCompleteWeeks: false,
      showSelectedDay: false,
      yearFormat: "numeric"
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
    return this[internal.state].monthFormat;
  }
  set monthFormat(monthFormat) {
    this[internal.setState]({ monthFormat });
  }

  /**
   * The class or tag used to create the grid of days.
   *
   * @type {PartDescriptor}
   * @default CalendarDays
   */
  get monthDaysPartType() {
    return this[internal.state].monthDaysPartType;
  }
  set monthDaysPartType(monthDaysPartType) {
    this[internal.setState]({ monthDaysPartType });
  }

  /**
   * The class or tag used to create the header showing the
   * month and year.
   *
   * @type {PartDescriptor}
   * @default CalendarMonthYearHeader
   */
  get monthYearHeaderPartType() {
    return this[internal.state].monthYearHeaderPartType;
  }
  set monthYearHeaderPartType(monthYearHeaderPartType) {
    this[internal.setState]({ monthYearHeaderPartType });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    renderParts(this[internal.shadowRoot], this[internal.state], changed);

    if (changed.dayPartType || changed.monthDaysPartType) {
      /** @type {any} */ (this[internal.ids].monthDays).dayPartType = this[
        internal.state
      ].dayPartType;
    }

    if (
      changed.locale ||
      changed.monthDaysPartType ||
      changed.monthYearHeaderPartType ||
      changed.dayNamesHeaderPartType
    ) {
      const locale = this[internal.state].locale;
      /** @type {any} */ (this[internal.ids].monthDays).locale = locale;
      /** @type {any} */ (this[internal.ids].monthYearHeader).locale = locale;
      /** @type {any} */ (this[internal.ids].dayNamesHeader).locale = locale;
    }

    if (changed.date || changed.monthDaysPartType) {
      const { date } = this[internal.state];
      if (date) {
        const startDate = calendar.firstDateOfMonth(date);
        const endDate = calendar.lastDateOfMonth(date);
        const dayCount = endDate.getDate();
        Object.assign(this[internal.ids].monthDays, {
          date,
          dayCount,
          startDate
        });
        /** @type {any} */ (this[
          internal.ids
        ].monthYearHeader).date = calendar.firstDateOfMonth(date);
      }
    }

    if (changed.daysOfWeekFormat || changed.dayNamesHeaderPartType) {
      const { daysOfWeekFormat } = this[internal.state];
      /** @type {any} */ (this[
        internal.ids
      ].dayNamesHeader).format = daysOfWeekFormat;
    }

    if (changed.showCompleteWeeks || changed.monthDaysPartType) {
      const { showCompleteWeeks } = this[internal.state];
      /** @type {any} */ (this[
        internal.ids
      ].monthDays).showCompleteWeeks = showCompleteWeeks;
    }

    if (changed.showSelectedDay || changed.monthDaysPartType) {
      const { showSelectedDay } = this[internal.state];
      /** @type {any} */ (this[
        internal.ids
      ].monthDays).showSelectedDay = showSelectedDay;
    }

    if (changed.monthFormat || changed.monthYearHeaderPartType) {
      const { monthFormat } = this[internal.state];
      /** @type {any} */ (this[
        internal.ids
      ].monthYearHeader).monthFormat = monthFormat;
    }

    if (changed.yearFormat || changed.monthYearHeaderPartType) {
      const { yearFormat } = this[internal.state];
      /** @type {any} */ (this[
        internal.ids
      ].monthYearHeader).yearFormat = yearFormat;
    }
  }

  get showCompleteWeeks() {
    return this[internal.state].showCompleteWeeks;
  }
  set showCompleteWeeks(showCompleteWeeks) {
    this[internal.setState]({ showCompleteWeeks });
  }

  get showSelectedDay() {
    return this[internal.state].showSelectedDay;
  }
  set showSelectedDay(showSelectedDay) {
    this[internal.setState]({ showSelectedDay });
  }

  get [internal.template]() {
    const result = template.html`
      <style>
        :host {
          display: inline-block;
        }

        [part~="month-year-header"] {
          display: block;
        }

        [part~="month-days"] {
          display: block;
        }
      </style>

      <div id="monthYearHeader" part="month-year-header"></div>
      <div id="dayNamesHeader" part="day-names-header" exportparts="day-name" format="short"></div>
      <div id="monthDays" part="month-days" exportparts="day"></div>
    `;
    renderParts(result.content, this[internal.state]);
    return result;
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
    return this[internal.state].yearFormat;
  }
  set yearFormat(yearFormat) {
    this[internal.setState]({ yearFormat });
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.dayNamesHeaderPartType) {
    const { dayNamesHeaderPartType } = state;
    const dayNamesHeader = root.getElementById("dayNamesHeader");
    if (dayNamesHeader) {
      template.transmute(dayNamesHeader, dayNamesHeaderPartType);
    }
  }
  if (!changed || changed.monthYearHeaderPartType) {
    const { monthYearHeaderPartType } = state;
    const monthYearHeader = root.getElementById("monthYearHeader");
    if (monthYearHeader) {
      template.transmute(monthYearHeader, monthYearHeaderPartType);
    }
  }
  if (!changed || changed.monthDaysPartType) {
    const { monthDaysPartType } = state;
    const monthDays = root.getElementById("monthDays");
    if (monthDays) {
      template.transmute(monthDays, monthDaysPartType);
    }
  }
}

export default CalendarMonth;
