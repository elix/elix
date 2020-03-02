import * as calendar from "./calendar.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import Button from "./Button.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import CalendarMonthNavigator from "./CalendarMonthNavigator.js";
import ComboBox from "./ComboBox.js";

const Base = CalendarElementMixin(ComboBox);

/**
 * Combo box that lets the user type a date or pick one from a popup calendar
 *
 * @inherits ComboBox
 * @mixes CalendarElementMixin
 * @part {CalendarMonthNavigator} calendar - the calendar showing dates to choose from
 * @part {div} calendar-container - container for the calendar
 * @part day - any of the day elements in the month grid
 * @part day-names-header - the column header showing the names of the days
 * @part month-days - the grid of days for the month
 * @part month-hear-header - the calendar header showing the month and/or year
 * @part {Button} today-button - the button that will navigate to today in the calendar
 */
class DateComboBox extends Base {
  get calendar() {
    return this[internal.shadowRoot] ? this[internal.ids].calendar : null;
  }

  /**
   * The class, tag, or template used to create the `calendar` part - the
   * element showing a calendar with selectable days.
   *
   * @type {PartDescriptor}
   * @default CalendarMonthNavigator
   */
  get calendarPartType() {
    return this[internal.state].calendarPartType;
  }
  set calendarPartType(calendarPartType) {
    this[internal.setState]({ calendarPartType });
  }

  get dateTimeFormatOptions() {
    return this[internal.state].dateTimeFormatOptions;
  }
  set dateTimeFormatOptions(dateTimeFormatOptions) {
    this[internal.setState]({ dateTimeFormatOptions });
  }

  get date() {
    return super.date;
  }
  set date(date) {
    super.date = date;
    this[internal.setState]({
      datePriority: true
    });
  }

  /**
   * The class, tag, or template used to create the `day` parts – the set of
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
    const dateTimeFormatOptions = {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    };

    return Object.assign(super[internal.defaultState], {
      calendarPartType: CalendarMonthNavigator,
      date: null,
      datePriority: false,
      dateSelected: false,
      dateTimeFormat: null,
      dateTimeFormatOptions,
      daysOfWeekFormat: "short",
      monthFormat: "long",
      timeBias: null,
      todayButtonPartType: Button,
      yearFormat: "numeric"
    });
  }

  /**
   * Format the given date as text.
   *
   * @private
   * @param {Date} date
   * @param {Intl.DateTimeFormat} dateTimeFormat
   */
  formatDate(date, dateTimeFormat) {
    return dateTimeFormat.format(date);
  }

  [internal.goDown]() {
    if (super[internal.goDown]) {
      super[internal.goDown]();
    }
    const date = this[internal.state].date || new Date();
    this[internal.setState]({
      date: calendar.offsetDateByDays(date, 7)
    });
    return true;
  }

  [internal.goLeft]() {
    if (super[internal.goLeft]) {
      super[internal.goLeft]();
    }
    const date = this[internal.state].date || new Date();
    this[internal.setState]({
      date: calendar.offsetDateByDays(date, -1)
    });
    return true;
  }

  [internal.goRight]() {
    if (super[internal.goRight]) {
      super[internal.goRight]();
    }
    const date = this[internal.state].date || new Date();
    this[internal.setState]({
      date: calendar.offsetDateByDays(date, 1)
    });
    return true;
  }

  [internal.goUp]() {
    if (super[internal.goUp]) {
      super[internal.goUp]();
    }
    const date = this[internal.state].date || new Date();
    this[internal.setState]({
      date: calendar.offsetDateByDays(date, -7)
    });
    return true;
  }

  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    let handled = false;

    const opened = this.opened;
    const date = this[internal.state].date || calendar.today();

    switch (event.key) {
      case "ArrowDown":
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goDown]();
        }
        break;

      case "ArrowLeft":
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goLeft]();
        }
        break;

      case "ArrowRight":
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goRight]();
        }
        break;

      case "ArrowUp":
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goUp]();
        }
        break;

      case "PageDown":
        if (opened) {
          this[internal.setState]({
            date: calendar.offsetDateByMonths(date, 1)
          });
          handled = true;
        }
        break;

      case "PageUp":
        if (opened) {
          this[internal.setState]({
            date: calendar.offsetDateByMonths(date, -1)
          });
          handled = true;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  get locale() {
    return super.locale;
  }
  set locale(locale) {
    // If external code sets the locale, it's impossible for that code to predict
    // the effects on the value, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[internal.raiseChangeEvents];
    this[internal.raiseChangeEvents] = true;
    super.locale = locale;
    this[internal.raiseChangeEvents] = saveRaiseChangesEvents;
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
   * Parse the given text as a Date.
   *
   * @private
   * @param {string} text
   * @param {Intl.DateTimeFormat} dateTimeFormat
   * @param {'future'|'past'} timeBias
   */
  parseDate(text, dateTimeFormat, timeBias) {
    return calendar.parseWithOptionalYear(text, dateTimeFormat, timeBias);
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.calendarPartType) {
      template.transmute(
        this[internal.ids].calendar,
        this[internal.state].calendarPartType
      );
      this[internal.ids].calendar.addEventListener("date-changed", event => {
        this[internal.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        this.date = cast.detail.date;
        this[internal.raiseChangeEvents] = false;
      });
      this[internal.ids].calendar.addEventListener("mousedown", event => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        this[internal.raiseChangeEvents] = true;
        this.close();
        event.preventDefault(); // Keep focus on input.
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.todayButtonPartType) {
      template.transmute(
        this[internal.ids].todayButton,
        this[internal.state].todayButtonPartType
      );
      this[internal.ids].todayButton.addEventListener("mousedown", event => {
        // Only process events for the main (usually left) button.
        if (/** @type {MouseEvent} */ (event).button !== 0) {
          return;
        }
        this[internal.raiseChangeEvents] = true;
        this.date = calendar.today();
        this.close();
        event.preventDefault(); // Keep focus on input.
        this[internal.raiseChangeEvents] = false;
      });
    }
    const cast = /** @type {any} */ (this[internal.ids].calendar);
    if (changed.date || changed.calendarPartType) {
      cast.date = this[internal.state].date;
    }
    if (
      (changed.daysOfWeekFormat || changed.calendarPartType) &&
      "daysOfWeekFormat" in cast
    ) {
      cast.daysOfWeekFormat = this[internal.state].daysOfWeekFormat;
    }
    if (changed.locale || changed.calendarPartType) {
      cast.locale = this[internal.state].locale;
    }
    if (
      (changed.monthFormat || changed.calendarPartType) &&
      "monthFormat" in cast
    ) {
      cast.monthFormat = this[internal.state].monthFormat;
    }
    if (
      (changed.yearFormat || changed.calendarPartType) &&
      "yearFormat" in cast
    ) {
      cast.yearFormat = this[internal.state].yearFormat;
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // If the date changed while focused, assume user changed date.
    if (changed.date || changed.value) {
      if (state.focused) {
        Object.assign(effects, { userChangedDate: true });
      }
    }

    // Update value from date if:
    // the date was changed from the outside,
    // we're closing or losing focus and the user's changed the date,
    // or the format changed and the date was the last substantive property set.
    if (
      changed.date ||
      changed.dateTimeFormat ||
      changed.focused ||
      changed.opened
    ) {
      const {
        closeResult,
        date,
        datePriority,
        dateTimeFormat,
        focused,
        opened,
        userChangedDate
      } = state;
      const closing = changed.opened && !opened;
      const canceled = closeResult && closeResult.canceled;
      const blur = changed.focused && !focused;
      if (
        (changed.date && !focused) ||
        (blur && userChangedDate) ||
        (closing && userChangedDate && !canceled) ||
        (changed.dateTimeFormat && datePriority)
      ) {
        const formattedDate =
          date && dateTimeFormat ? this.formatDate(date, dateTimeFormat) : "";
        // See notes on mobile at ComboBox.defaultState.
        const probablyMobile = matchMedia("(pointer: coarse)").matches;
        const selectText = formattedDate.length > 0 && !probablyMobile;
        Object.assign(effects, {
          selectText,
          value: formattedDate
        });
      }
    }

    // Update date from value if the value was changed, or the date format or
    // time bias changed and the value was the last substantive property set.
    if (changed.dateTimeFormat || changed.timeBias || changed.value) {
      const { datePriority, dateTimeFormat, timeBias, value } = state;
      if (
        dateTimeFormat &&
        (changed.value ||
          (!datePriority && (changed.dateTimeFormat || changed.timeBias)))
      ) {
        const parsedDate = this.parseDate(value, dateTimeFormat, timeBias);
        if (parsedDate) {
          Object.assign(effects, {
            date: parsedDate
          });
        }
      }
    }

    // Update our date format if the locale or format options change.
    if (changed.dateTimeFormatOptions || changed.locale) {
      const { dateTimeFormatOptions, locale } = state;
      const dateTimeFormat = calendar.dateTimeFormat(
        locale,
        dateTimeFormatOptions
      );
      Object.assign(effects, { dateTimeFormat });
    }

    return effects;
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Replace default slot with calendar.
    const calendarTemplate = template.html`
      <style>
        [part~="calendar-container"] {
          display: flex;
          flex-direction: column;
        }
      </style>
      <div part="calendar-container">
        <div id="calendar" part="calendar" exportparts="day, day-names-header, month-days, month-hear-header" tabindex="-1"></div>
        <div id="todayButton" part="today-button">Today</div>
      </div>
    `;
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      template.transmute(defaultSlot, calendarTemplate);
    }

    return result;
  }

  /**
   * If set, this indicates whether a date containing only a month and day
   * should infer a year such that the time is in the future or in the past.
   *
   * Example: the current date is July 1, the locale is "en-US", and the
   * supplied value is "9/1" (September 1 in the U.S.), then if `timeBias` is
   * not set, the inferred year is the present year. If `timeBias` is set to
   * "past", the date is taken to be a past date, so the inferred year will be
   * the _previous_ year.
   *
   * @type {'future'|'past'|null}
   * @default null
   */
  get timeBias() {
    return this[internal.state].timeBias;
  }
  set timeBias(timeBias) {
    this[internal.setState]({ timeBias });
  }

  /**
   * The class, tag, or template used to create the `today-button` part – the
   * button that takes the user back to the current date.
   *
   * @type {PartDescriptor}
   * @default Button
   */
  get todayButtonPartType() {
    return this[internal.state].todayButtonPartType;
  }
  set todayButtonPartType(todayButtonPartType) {
    this[internal.setState]({ todayButtonPartType });
  }

  get value() {
    return super.value;
  }
  set value(value) {
    // If external code sets the value, it's impossible for that code to predict
    // the effects on the date, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[internal.raiseChangeEvents];
    this[internal.raiseChangeEvents] = true;
    super.value = value;
    this[internal.setState]({
      datePriority: false
    });
    this[internal.raiseChangeEvents] = saveRaiseChangesEvents;
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

export default DateComboBox;
