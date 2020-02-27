import * as internal from "./internal.js";
import * as calendar from "./calendar.js";
import * as template from "../core/template.js";
import ReactiveElement from "../core/ReactiveElement.js";

/**
 * Header showing the localized days of the week
 *
 * [A default representation of day names in browser's default locale](/demos/calendarDayNamesHeader.html)
 *
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
 *
 * In the case of this component, it will show the appropriate names of the days
 * of the week for a specific locale (or, by default, the user's current
 * locale). The day(s) associated with the weekend in that locale will also be
 * indicated. It will also correctly reflect the typical first day of the week
 * for that locale. Example: U.S. calendars typically start with Sunday as the
 * first day of a week, while British calendars typically start with Monday as
 * the first day.
 *
 * @inherits ReactiveElement
 * @part day-name - any of the names for the days of the week
 */
class CalendarDayNamesHeader extends ReactiveElement {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      format: "short",
      locale: navigator.language
    });
  }

  /**
   * The format used to render the day names.
   *
   * @type {('long'|'narrow'|'short')}
   * @default 'short'
   */
  get format() {
    return this[internal.state].format;
  }
  set format(format) {
    this[internal.setState]({ format });
  }

  /**
   * A string that identifies a language and a region using a BCP 47 language
   * tag. This works the same as the `CalendarElementMixin`
   * [locale](CalendarElementMixin#locale) property.
   *
   * @type {string}
   */
  get locale() {
    return this[internal.state].locale;
  }
  set locale(locale) {
    this[internal.setState]({ locale });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.format || changed.locale) {
      const { format, locale } = this[internal.state];
      const formatter = calendar.dateTimeFormat(locale, {
        weekday: format
      });
      const firstDayOfWeek = calendar.firstDayOfWeek(locale);
      const weekendStart = calendar.weekendStart(locale);
      const weekendEnd = calendar.weekendEnd(locale);
      const date = new Date(2017, 0, 1); // A Sunday
      const dayNameParts = this[internal.shadowRoot].querySelectorAll(
        '[part~="day-name"]'
      );
      for (let i = 0; i <= 6; i++) {
        const dayOfWeek = (firstDayOfWeek + i) % 7;
        date.setDate(dayOfWeek + 1);
        const weekend = dayOfWeek === weekendStart || dayOfWeek === weekendEnd;
        const dayElement = dayNameParts[i];
        dayElement.toggleAttribute("weekday", !weekend);
        dayElement.toggleAttribute("weekend", weekend);
        dayElement.textContent = formatter.format(date);
      }
    }
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          direction: ltr;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
      </style>

      <div id="day0" part="day-name"></div>
      <div id="day1" part="day-name"></div>
      <div id="day2" part="day-name"></div>
      <div id="day3" part="day-name"></div>
      <div id="day4" part="day-name"></div>
      <div id="day5" part="day-name"></div>
      <div id="day6" part="day-name"></div>
    `;
  }
}

export default CalendarDayNamesHeader;
