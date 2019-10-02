import * as calendar from './calendar.js';
import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Adds locale-sensitive date support.
 *
 * This mixin is typically used in creating calendar components. All of the Elix
 * calendar components attempt to provide full [international calendar
 * support](CalendarMonth#international-support) to the extent currently
 * possible in the user's web browser.
 *
 * @module CalendarElementMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function CalendarElementMixin(Base) {
  // The class prototype added by the mixin.
  class CalendarElement extends Base {
    [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
      }
      // TODO: call calendar.datesEqual(date, previousState.date)?
      if (changed.date && this[internal.raiseChangeEvents]) {
        const date = this[internal.state].date;
        /**
         * Raised when the `date` property changes.
         *
         * @event date-changed
         */
        const event = new CustomEvent('date-changed', {
          detail: { date }
        });
        this.dispatchEvent(event);
      }
    }

    /**
     * The date that should be shown by the element. For elements that show a
     * range of dates (a month, a week, etc.), the referenced date will be
     * included in the range.
     *
     * This property can be set as a string, which will be parsed and converted
     * to a JavaScript `Date`.
     *
     * If not specified, the default `date` value is the current date.
     *
     * @type {Date|string}
     */
    get date() {
      return this[internal.state].date;
    }
    set date(date) {
      const parsed = typeof date === 'string' ? new Date(date) : date;
      // Only update state if actual date value differs from current state.
      if (!calendar.datesEqual(parsed, this[internal.state].date)) {
        this[internal.setState]({
          date: parsed
        });
      }
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        date: null,
        locale: navigator.language
      });
    }

    /**
     * A string that identifies a language and a region using a BCP 47
     * language tag. This is the same format used by to identify a
     * locale in the standard `Intl` internationalization API.
     * See the
     * [locales argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument)
     * documentation for details.
     *
     * Calendar elements are region-sensitive, so language alone is
     * insufficient. Accordingly, the locale should identify at least a language
     * and a region. Examples: "en-US" identifies US English, while "en-GB"
     * identifies English in Great Britain. The use of "en" on its own would
     * be insufficient.
     *
     * @type {string}
     */
    get locale() {
      return this[internal.state].locale;
    }
    set locale(locale) {
      this[internal.setState]({ locale });
    }
  }

  return CalendarElement;
}
