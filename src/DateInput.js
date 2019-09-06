import * as calendar from './calendar.js';
import * as internal from './internal.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import Input from './Input.js';


const Base =
  CalendarElementMixin(
    Input
  );


/**
 * Input element that can parse dates in locale-specific formats
 * 
 * @inherits Input
 * @mixes CalendarElementMixin
 */
class DateInput extends Base {

  [internal.componentDidMount]() {
    super[internal.componentDidMount]();
    this[internal.$].inner.addEventListener('blur', () => {
      this[internal.raiseChangeEvents] = true;
      this[internal.setState]({
        focused: false
      });
      this[internal.raiseChangeEvents] = false;
    });
    this[internal.$].inner.addEventListener('focus', () => {
      this[internal.raiseChangeEvents] = true;
      this[internal.setState]({
        focused: true
      });
      this[internal.raiseChangeEvents] = false;
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

  get dateTimeFormatOptions() {
    return this[internal.state].dateTimeFormatOptions;
  }
  set dateTimeFormatOptions(dateTimeFormatOptions) {
    this[internal.setState]({
      dateTimeFormatOptions
    });
  }

  get [internal.defaultState]() {
    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };
    const state = Object.assign(super[internal.defaultState], {
      dateSelected: false,
      dateTimeFormat: null,
      dateTimeFormatOptions,
      datePriority: false,
      focused: false,
      timeBias: null
    });

    // If the date changed while focused, assume user changed date.
    state.onChange('date', state => {
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
    state.onChange(['date', 'dateTimeFormat', 'focused'], (state, changed) => {
      const {
        date,
        datePriority,
        dateTimeFormat,
        focused,
        userChangedDate
      } = state;
      const blur = changed.focused && !focused;
      if ((changed.date && !focused) ||
          (blur && userChangedDate) ||
          (changed.dateTimeFormat && datePriority)) {
        const formattedDate = date ?
          this.formatDate(date, dateTimeFormat) :
          '';
        const innerProperties = Object.assign({}, state.innerProperties, {
          value: formattedDate
        });
        return {
          innerProperties,
          selectText: formattedDate.length > 0
        };
      }
      return null;
    });

    // Update date from value if the value was changed, or the date format or
    // time bias changed and the value was the last substantive property set.
    state.onChange(['dateTimeFormat', 'innerProperties', 'timeBias'], (state, changed) => {
      const {
        date,
        datePriority,
        dateTimeFormat,
        innerProperties,
        timeBias
      } = state;
      const value = innerProperties.value;
      // If the innerProperties changed, we don't know whether its was
      // innerProperties.value that changed, or some other property of the inner
      // input element. We conservatively assume it was the input. We'll then
      // check to see whether the date actually changed -- a check we wouldn't
      // normally need to make -- before deciding whether to return a new date.
      if (dateTimeFormat && value &&
          (changed.innerProperties ||
          (!datePriority && (changed.dateTimeFormat || changed.timeBias)))) {
        const parsedDate = this.parseDate(value, dateTimeFormat, timeBias);
        if (parsedDate && !calendar.datesEqual(date, parsedDate)) {
          return {
            date: parsedDate
          };
        }
      }
      return null;
    });

    // Update our time format if the locale or format options change.
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
  
  get [internal.template]() {
    return template.concat(super[internal.template], template.html`
      <style>
        :host {
          width: 6em;
        }
      </style>
    `);
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
   */
  get timeBias() {
    return this[internal.state].timeBias;
  }
  set timeBias(timeBias) {
    this[internal.setState]({
      timeBias
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

}


export default DateInput;
customElements.define('elix-date-input', DateInput);
