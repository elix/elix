import CalendarMonthYearHeader from "../base/CalendarMonthYearHeader.js";
import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * CalendarMonthYearHeader component in the Plain reference design system
 *
 * @inherits CalendarMonthYearHeader
 */
class PlainCalendarMonthYearHeader extends CalendarMonthYearHeader {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
