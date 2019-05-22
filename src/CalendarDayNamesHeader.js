import * as symbols from './symbols.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


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
 */
class CalendarDayNamesHeader extends ReactiveElement {

  get defaultState() {
    return Object.assign(super.defaultState, {
      format: 'short',
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
    return this.state.format;
  }
  set format(format) {
    this.setState({ format });
  }

  /**
   * A string that identifies a language and a region using a BCP 47 language
   * tag. This works the same as the `CalendarElementMixin`
   * [locale](CalendarElementMixin#locale) property.
   * 
   * @type {string}
   */
  get locale() {
    return this.state.locale;
  }
  set locale(locale) {
    this.setState({ locale });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.format || changed.locale) {
      const { format, locale } = this.state;
      const formatter = calendar.dateTimeFormat(locale, {
        weekday: format
      });
      const firstDayOfWeek = calendar.firstDayOfWeek(locale);
      const weekendStart = calendar.weekendStart(locale);
      const weekendEnd = calendar.weekendEnd(locale);
      const date = new Date(2017, 0, 1); // A Sunday
      for (let i = 0; i <= 6; i++) {
        const dayOfWeek = (firstDayOfWeek + i) % 7;
        date.setDate(dayOfWeek + 1);
        const weekend = dayOfWeek === weekendStart || dayOfWeek === weekendEnd;
        const dayElement = this.$[`day${i}`];
        dayElement.classList.toggle('weekend', weekend);
        dayElement.textContent = formatter.format(date);
      }
    }
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          direction: ltr;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .dayOfWeek {
          padding: 0.3em;
          text-align: center;
          white-space: nowrap;
        }

        .dayOfWeek.weekend {
          color: gray;
        }
      </style>

      <div id="day0" class="dayOfWeek"></div>
      <div id="day1" class="dayOfWeek"></div>
      <div id="day2" class="dayOfWeek"></div>
      <div id="day3" class="dayOfWeek"></div>
      <div id="day4" class="dayOfWeek"></div>
      <div id="day5" class="dayOfWeek"></div>
      <div id="day6" class="dayOfWeek"></div>
    `;
  }

}


export default CalendarDayNamesHeader;
customElements.define('elix-calendar-day-names-header', CalendarDayNamesHeader);
