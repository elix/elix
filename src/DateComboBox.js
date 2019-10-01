import * as calendar from './calendar.js';
import * as internal from './internal.js';
import * as template from './template.js';
import ArrowDirectionButton from './ArrowDirectionButton.js';
import CalendarDayButton from './CalendarDayButton.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import CalendarMonthNavigator from './CalendarMonthNavigator.js';
import ComboBox from './ComboBox.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  CalendarElementMixin(
    ComboBox
  );


/**
 * Combo box that lets the user type a date or pick one from a popup calendar
 * 
 * @inherits ComboBox
 * @mixes CalendarElementMixin
 * @elementrole {CalendarMonthNavigator} calendar
 * @elementrole {SeamlessButton} todayButton
 */
class DateComboBox extends Base {

  /**
   * The class, tag, or template used to create the left and right arrow
   * buttons.
   * 
   * @type {Role}
   * @default ArrowDirectionButton
   */
  get arrowButtonRole() {
    return this[internal.state].arrowButtonRole;
  }
  set arrowButtonRole(arrowButtonRole) {
    this[internal.setState]({
      arrowButtonRole
    });
  }
  
  get calendar() {
    return this.shadowRoot ?
      this[internal.ids].calendar :
      null;
  }

  /**
   * The class, tag, or template used to create the calendar.
   * 
   * @type {Role}
   * @default CalendarMonthNavigator
   */
  get calendarRole() {
    return this[internal.state].calendarRole;
  }
  set calendarRole(calendarRole) {
    this[internal.setState]({
      calendarRole
    });
  }

  get dateTimeFormatOptions() {
    return this[internal.state].dateTimeFormatOptions;
  }
  set dateTimeFormatOptions(dateTimeFormatOptions) {
    this[internal.setState]({
      dateTimeFormatOptions
    });
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
   * The class, tag, or template used to create the day elements.
   * 
   * @type {Role}
   * @default CalendarDay
   */
  get dayRole() {
    return this[internal.state].dayRole;
  }
  set dayRole(dayRole) {
    this[internal.setState]({
      dayRole
    });
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
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };

    const state = Object.assign(super[internal.defaultState], {
      arrowButtonRole: ArrowDirectionButton,
      calendarRole: CalendarMonthNavigator,
      date: null,
      datePriority: false,
      dateSelected: false,
      dateTimeFormat: null,
      dateTimeFormatOptions,
      dayRole: CalendarDayButton,
      daysOfWeekFormat: 'short',
      monthFormat: 'long',
      timeBias: null,
      todayButtonRole: SeamlessButton,
      yearFormat: 'numeric'
    });

    // If the date changed while focused, assume user changed date.
    state.onChange(['date', 'value'], state => {
      if (state.focused) {
        return {
          userChangedDate: true
        };
      }
      return null;
    })

    // Update value from date if:
    // the date was changed from the outside,
    // we're closing or losing focus and the user's changed the date,
    // or the format changed and the date was the last substantive property set.
    state.onChange(['date', 'dateTimeFormat', 'focused', 'opened'], (state, changed) => {
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
      if ((changed.date && !focused) ||
          (blur && userChangedDate) ||
          (closing && userChangedDate && !canceled) ||
          (changed.dateTimeFormat && datePriority)) {
        const formattedDate = date && dateTimeFormat ?
          this.formatDate(date, dateTimeFormat) :
          '';
        // See notes on mobile at ComboBox.defaultState.
        const probablyMobile = matchMedia('(pointer: coarse)').matches;
        const selectText = formattedDate.length > 0 && !probablyMobile;
        return {
          selectText,
          value: formattedDate
        };
      }
      return null;
    });

    // Update date from value if the value was changed, or the date format or
    // time bias changed and the value was the last substantive property set.
    state.onChange(['dateTimeFormat', 'timeBias', 'value'], (state, changed) => {
      const {
        datePriority,
        dateTimeFormat,
        timeBias,
        value
      } = state;
      if (dateTimeFormat &&
          (changed.value ||
          (!datePriority && (changed.dateTimeFormat || changed.timeBias)))) {
        const parsedDate = this.parseDate(value, dateTimeFormat, timeBias);
        if (parsedDate) {
          return {
            date: parsedDate
          };
        }
      }
      return null;
    });

    // Update our date format if the locale or format options change.
    state.onChange(['dateTimeFormatOptions', 'locale'], state => {
      const { dateTimeFormatOptions, locale } = state;
      const dateTimeFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
      return {
        dateTimeFormat
      };
    });

    return state;
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
    if (super[internal.goDown]) { super[internal.goDown](); }
    const date = this[internal.state].date || new Date();
    this[internal.setState]({
      date: calendar.offsetDateByDays(date, 7)
    });
    return true;
  }

  [internal.goLeft]() {
    if (super[internal.goLeft]) { super[internal.goLeft](); }
    const date = this[internal.state].date || new Date();
    this[internal.setState]({
      date: calendar.offsetDateByDays(date, -1)
    });
    return true;
  }

  [internal.goRight]() {
    if (super[internal.goRight]) { super[internal.goRight](); }
    const date = this[internal.state].date || new Date();
    this[internal.setState]({
      date: calendar.offsetDateByDays(date, 1)
    });
    return true;
  }

  [internal.goUp]() {
    if (super[internal.goUp]) { super[internal.goUp](); }
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

      case 'ArrowDown':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goDown]();
        }
        break;

      case 'ArrowLeft':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goLeft]();
        }
        break;

      case 'ArrowRight':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goRight]();
        }
        break;

      case 'ArrowUp':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[internal.goUp]();
        }
        break;

      case 'PageDown':
        if (opened) {
          this[internal.setState]({
            date: calendar.offsetDateByMonths(date, 1)
          });
          handled = true;
        }
        break;
        
      case 'PageUp':
        if (opened) {
          this[internal.setState]({
            date: calendar.offsetDateByMonths(date, -1)
          });
          handled = true;
        }
        break;

    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[internal.keydown] && super[internal.keydown](event));
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
    this[internal.setState]({
      monthFormat
    });
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
    if (changed.calendarRole) {
      template.transmute(this[internal.ids].calendar, this[internal.state].calendarRole);
      this[internal.ids].calendar.addEventListener('date-changed', event => {
        this[internal.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        this.date = cast.detail.date;
        this[internal.raiseChangeEvents] = false;
      });
      this[internal.ids].calendar.addEventListener('mousedown', event => {
        this[internal.raiseChangeEvents] = true;
        this.close();
        event.preventDefault(); // Keep focus on input.
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.todayButtonRole) {
      template.transmute(this[internal.ids].todayButton, this[internal.state].todayButtonRole);
      this[internal.ids].todayButton.addEventListener('mousedown', event => {
        this[internal.raiseChangeEvents] = true;
        this.date = calendar.today();
        this.close();
        event.preventDefault(); // Keep focus on input.
        this[internal.raiseChangeEvents] = false;
      });
    }
    const cast = /** @type {any} */ (this[internal.ids].calendar);
    if (changed.arrowButtonRole && 'arrowButtonRole' in this[internal.ids].calendar) {
      cast.arrowButtonRole = this[internal.state].arrowButtonRole;
    }
    if (changed.date) {
      cast.date = this[internal.state].date;
    }
    if (changed.dayRole && 'dayRole' in cast) {
      cast.dayRole = this[internal.state].dayRole;
    }
    if (changed.daysOfWeekFormat && 'daysOfWeekFormat' in cast) {
      cast.daysOfWeekFormat = this[internal.state].daysOfWeekFormat;
    }
    if (changed.locale) {
      cast.locale = this[internal.state].locale;
    }
    if (changed.monthFormat && 'monthFormat' in cast) {
      cast.monthFormat = this[internal.state].monthFormat;
    }
    if (changed.yearFormat && 'yearFormat' in cast) {
      cast.yearFormat = this[internal.state].yearFormat;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Replace default slot with calendar.
    const calendarTemplate = template.html`
      <style>
        :host {
          width: 8em;
        }

        #calendarContainer {
          display: flex;
          flex-direction: column;
        }

        #calendar {
          margin: 0.5em;
        }

        #todayButton {
          border: 1px solid transparent;
          padding: 0.5em;
        }

        #todayButton:hover {
          border-color: gray;
        }
      </style>
      <div id="calendarContainer">
        <div id="calendar" tabindex="-1"></div>
        <button id="todayButton">Today</button>
      </div>
    `;
    const defaultSlot = template.defaultSlot(result.content);
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
    this[internal.setState]({
      timeBias
    });
  }

  /**
   * The class, tag, or template used to create the (Go to) "Today" button.
   * 
   * @type {Role}
   * @default SeamlessButton
   */
  get todayButtonRole() {
    return this[internal.state].todayButtonRole;
  }
  set todayButtonRole(todayButtonRole) {
    this[internal.setState]({
      todayButtonRole
    });
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
    this[internal.setState]({
      yearFormat
    });
  }

}


export default DateComboBox;
