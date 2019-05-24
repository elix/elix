import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
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
   * @type {function|string|HTMLTemplateElement}
   * @default ArrowDirectionButton
   */
  get arrowButtonRole() {
    return this.state.arrowButtonRole;
  }
  set arrowButtonRole(arrowButtonRole) {
    this.setState({
      arrowButtonRole
    });
  }
  
  get calendar() {
    return this.shadowRoot ?
      this.$.calendar :
      null;
  }

  /**
   * The class, tag, or template used to create the calendar.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default CalendarMonthNavigator
   */
  get calendarRole() {
    return this.state.calendarRole;
  }
  set calendarRole(calendarRole) {
    this.setState({
      calendarRole
    });
  }

  get dateTimeFormatOptions() {
    return this.state.dateTimeFormatOptions;
  }
  set dateTimeFormatOptions(dateTimeFormatOptions) {
    this.setState({
      dateTimeFormatOptions
    });
  }

  get date() {
    return super.date;
  }
  set date(date) {
    super.date = date;
    this.setState({
      datePriority: true
    });
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
    this.setState({
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
    return this.state.daysOfWeekFormat;
  }
  set daysOfWeekFormat(daysOfWeekFormat) {
    this.setState({ daysOfWeekFormat });
  }

  get defaultState() {

    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };

    const state = Object.assign(super.defaultState, {
      arrowButtonRole: ArrowDirectionButton,
      calendarRole: CalendarMonthNavigator,
      date: calendar.today(),
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

  formatDate(date, dateTimeFormat) {
    return dateTimeFormat.format(date);
  }

  [symbols.goDown]() {
    if (super[symbols.goDown]) { super[symbols.goDown](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, 7)
    });
    return true;
  }

  [symbols.goLeft]() {
    if (super[symbols.goLeft]) { super[symbols.goLeft](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, -1)
    });
    return true;
  }

  [symbols.goRight]() {
    if (super[symbols.goRight]) { super[symbols.goRight](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, 1)
    });
    return true;
  }

  [symbols.goUp]() {
    if (super[symbols.goUp]) { super[symbols.goUp](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, -7)
    });
    return true;
  }

  [symbols.keydown](event) {
    let handled = false;

    const opened = this.opened;
    const date = this.state.date || calendar.today();

    switch (event.key) {

      case 'ArrowDown':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goDown]();
        }
        break;

      case 'ArrowLeft':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goLeft]();
        }
        break;

      case 'ArrowRight':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goRight]();
        }
        break;

      case 'ArrowUp':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goUp]();
        }
        break;

      case 'PageDown':
        if (opened) {
          this.setState({
            date: calendar.offsetDateByMonths(date, 1)
          });
          handled = true;
        }
        break;
        
      case 'PageUp':
        if (opened) {
          this.setState({
            date: calendar.offsetDateByMonths(date, -1)
          });
          handled = true;
        }
        break;

    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  get locale() {
    return super.locale;
  }
  set locale(locale) {
    // If external code sets the locale, it's impossible for that code to predict
    // the effects on the value, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[symbols.raiseChangeEvents];
    this[symbols.raiseChangeEvents] = true;
    super.locale = locale;
    this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
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

  parseDate(text, dateTimeFormat, timeBias) {
    return calendar.parseWithOptionalYear(text, dateTimeFormat, timeBias);
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.calendarRole) {
      template.transmute(this.$.calendar, this.state.calendarRole);
      this.$.calendar.addEventListener('date-changed', event => {
        this[symbols.raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        this.date = cast.detail.date;
        this[symbols.raiseChangeEvents] = false;
      });
      this.$.calendar.addEventListener('mousedown', event => {
        this[symbols.raiseChangeEvents] = true;
        this.close();
        event.preventDefault(); // Keep focus on input.
        this[symbols.raiseChangeEvents] = false;
      });
    }
    if (changed.todayButtonRole) {
      template.transmute(this.$.todayButton, this.state.todayButtonRole);
      this.$.todayButton.addEventListener('mousedown', event => {
        this[symbols.raiseChangeEvents] = true;
        this.date = calendar.today();
        this.close();
        event.preventDefault(); // Keep focus on input.
        this[symbols.raiseChangeEvents] = false;
      });
    }
    const cast = /** @type {any} */ (this.$.calendar);
    if (changed.arrowButtonRole && 'arrowButtonRole' in this.$.calendar) {
      cast.arrowButtonRole = this.state.arrowButtonRole;
    }
    if (changed.date) {
      cast.date = this.state.date;
    }
    if (changed.dayRole && 'dayRole' in cast) {
      cast.dayRole = this.state.dayRole;
    }
    if (changed.daysOfWeekFormat && 'daysOfWeekFormat' in cast) {
      cast.daysOfWeekFormat = this.state.daysOfWeekFormat;
    }
    if (changed.locale) {
      cast.locale = this.state.locale;
    }
    if (changed.monthFormat && 'monthFormat' in cast) {
      cast.monthFormat = this.state.monthFormat;
    }
    if (changed.yearFormat && 'yearFormat' in cast) {
      cast.yearFormat = this.state.yearFormat;
    }
  }

  get [symbols.template]() {
    const result = super[symbols.template];

    // Replace default slot with calendar.
    const calendarTemplate = template.html`
      <style>
        :host {
          width: 8em;
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
      <div id="calendar" tabindex="-1"></div>
      <button id="todayButton">Today</button>
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
    return this.state.timeBias;
  }
  set timeBias(timeBias) {
    this.setState({
      timeBias
    });
  }

  /**
   * The class, tag, or template used to create the (Go to) "Today" button.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default SeamlessButton
   */
  get todayButtonRole() {
    return this.state.todayButtonRole;
  }
  set todayButtonRole(todayButtonRole) {
    this.setState({
      todayButtonRole
    });
  }

  get value() {
    return super.value;
  }
  set value(value) {
    // If external code sets the value, it's impossible for that code to predict
    // the effects on the date, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[symbols.raiseChangeEvents];
    this[symbols.raiseChangeEvents] = true;
    super.value = value;
    this.setState({
      datePriority: false
    });
    this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
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


export default DateComboBox;
customElements.define('elix-date-combo-box', DateComboBox);
