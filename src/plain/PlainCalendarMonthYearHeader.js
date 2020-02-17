import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import CalendarMonthYearHeader from "../base/CalendarMonthYearHeader.js";

class PlainCalendarMonthYearHeader extends CalendarMonthYearHeader {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            font-size: larger;
            font-weight: bold;
            padding: 0.3em;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainCalendarMonthYearHeader;
