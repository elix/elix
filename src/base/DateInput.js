import * as calendar from "./calendar.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import Input from "./Input.js";
import {
  defaultState,
  ids,
  raiseChangeEvents,
  rendered,
  setState,
  state,
  stateEffects,
} from "./internal.js";

const Base = CalendarElementMixin(Input);

/**
 * Input element that can parse dates in locale-specific formats
 *
 * @inherits Input
 * @mixes CalendarElementMixin
 */
class DateInput extends Base {
  get date() {
    return super.date;
  }
  set date(date) {
    super.date = date;
    this[setState]({
      datePriority: true,
    });
  }

  get dateTimeFormatOptions() {
    return this[state].dateTimeFormatOptions;
  }
  set dateTimeFormatOptions(dateTimeFormatOptions) {
    this[setState]({ dateTimeFormatOptions });
  }

  get [defaultState]() {
    const dateTimeFormatOptions = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return Object.assign(super[defaultState], {
      dateSelected: false,
      dateTimeFormat: null,
      dateTimeFormatOptions,
      datePriority: false,
      focused: false,
      timeBias: null,
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

  get locale() {
    return super.locale;
  }
  set locale(locale) {
    // If external code sets the locale, it's impossible for that code to predict
    // the effects on the value, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[raiseChangeEvents];
    this[raiseChangeEvents] = true;
    super.locale = locale;
    this[raiseChangeEvents] = saveRaiseChangesEvents;
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

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);
    this[ids].inner.addEventListener("blur", () => {
      this[raiseChangeEvents] = true;
      this[setState]({
        focused: false,
      });
      this[raiseChangeEvents] = false;
    });
    this[ids].inner.addEventListener("focus", () => {
      this[raiseChangeEvents] = true;
      this[setState]({
        focused: true,
      });
      this[raiseChangeEvents] = false;
    });
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // If the date changed while focused, assume user changed date.
    if (changed.date && state.focused) {
      Object.assign(effects, {
        userChangedDate: true,
      });
    }

    // Update value from date if:
    // the date was changed from the outside,
    // we're closing or losing focus and the user's changed the date,
    // or the format changed and the date was the last substantive property set.
    if (changed.date || changed.dateTimeFormat || changed.focused) {
      const {
        date,
        datePriority,
        dateTimeFormat,
        focused,
        userChangedDate,
      } = state;
      const blur = changed.focused && !focused;
      if (
        (changed.date && !focused) ||
        (blur && userChangedDate) ||
        (changed.dateTimeFormat && datePriority)
      ) {
        const formattedDate = date ? this.formatDate(date, dateTimeFormat) : "";
        Object.assign(effects, {
          selectText: formattedDate.length > 0,
          value: formattedDate,
        });
      }
    }

    // Update date from value if the value was changed, or the date format or
    // time bias changed and the value was the last substantive property set.
    if (changed.dateTimeFormat || changed.timeBias || changed.value) {
      const { datePriority, dateTimeFormat, timeBias, value } = state;
      if (
        dateTimeFormat &&
        value &&
        (changed.value ||
          (!datePriority && (changed.dateTimeFormat || changed.timeBias)))
      ) {
        const parsedDate = this.parseDate(value, dateTimeFormat, timeBias);
        if (parsedDate) {
          Object.assign(effects, {
            date: parsedDate,
          });
        }
      }
    }

    // Update our time format if the locale or format options change.
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
    return this[state].timeBias;
  }
  set timeBias(timeBias) {
    this[setState]({ timeBias });
  }

  get value() {
    return super.value;
  }
  set value(value) {
    // If external code sets the value, it's impossible for that code to predict
    // the effects on the date, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[raiseChangeEvents];
    this[raiseChangeEvents] = true;
    super.value = value;
    this[setState]({
      datePriority: false,
    });
    this[raiseChangeEvents] = saveRaiseChangesEvents;
  }
}

export default DateInput;
