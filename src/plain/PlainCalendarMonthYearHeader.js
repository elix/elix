import * as internal from "../base/internal.js";
import CalendarMonthYearHeader from "../base/CalendarMonthYearHeader.js";
import html from "../core/html.js";

/**
 * CalendarMonthYearHeader component in the Plain reference design system
 *
 * @inherits CalendarMonthYearHeader
 */
class PlainCalendarMonthYearHeader extends CalendarMonthYearHeader {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            font-size: larger;
            font-weight: bold;
            padding: 0.3em;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainCalendarMonthYearHeader;
