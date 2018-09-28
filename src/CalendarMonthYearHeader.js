import { merge } from './updates.js';
import * as symbols from './symbols.js';;
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
    ReactiveElement
  );


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
