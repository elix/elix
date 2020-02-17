import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import CalendarDay from "../base/CalendarDay.js";

/**
 * CalendarDay component in the Plain reference design system
 *
 * @inherits CalendarDay
 */
class PlainCalendarDay extends CalendarDay {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            padding: 0.3em;
          }

          :host(.weekend) {
            color: gray;
          }

          :host(.outside-range) {
            color: lightgray;
          }

          :host(.today) {
            color: darkred;
            font-weight: bold;
          }

          :host([selected]) {
            background: #ddd;
          }

          #day {
            text-align: right;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainCalendarDay;
