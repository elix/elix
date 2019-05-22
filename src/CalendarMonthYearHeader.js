import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
    ReactiveElement
  );


/**
 * Header showing a localized month name and the year
 * 
 * [A default representation of the month and year in browser's default locale](/demos/calendarMonthYearHeader.html)
 * 
 * Given a reference `date` property, this component will show a calendar
 * representation of that month and year.
 * 
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
 * 
 * [CalendarMonth](CalendarMonth) instantiates `CalendarMonthYearHeader` to show
 * the name of the current month and the year as a header for the calendar
 * month.
 * 
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 */
class CalendarMonthYearHeader extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      date: calendar.today(),
      monthFormat: 'long',
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
    if (changed.date || changed.locale || changed.monthFormat || changed.yearFormat) {
      const { date, locale, monthFormat, yearFormat } = this.state;
      const formatOptions = {};
      if (monthFormat) {
        formatOptions.month = monthFormat;
      }
      if (yearFormat) {
        formatOptions.year = yearFormat;
      }
      const formatter = calendar.dateTimeFormat(locale, formatOptions);
      this.$.formatted.textContent = formatter.format(date);
    }
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          text-align: center;
        }
      </style>
      <div id="formatted"></div>
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

export default CalendarMonthYearHeader;
customElements.define('elix-calendar-month-year-header', CalendarMonthYearHeader);
