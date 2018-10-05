import { merge } from './updates.js';
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

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }

        #formatted {
          text-align: center;
        }
      </style>
      <div id="formatted"></div>
    `;
  }

  get updates() {
    const formatter = new Intl.DateTimeFormat(this.state.locale, {
      month: 'long',
      year: 'numeric'
    });
    const textContent = formatter.format(this.state.date);
    return merge(super.updates, {
      $: {
        formatted: {
          textContent
        }
      }
    });
  }}

export default CalendarMonthYearHeader;
customElements.define('elix-calendar-month-year-header', CalendarMonthYearHeader);
