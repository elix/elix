import * as internal from "../base/internal.js";
import CalendarDay from "../base/CalendarDay.js";
import html from "../core/html.js";

/**
 * CalendarDay component in the Plain reference design system
 *
 * @inherits CalendarDay
 */
class PlainCalendarDay extends CalendarDay {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            padding: 0.3em;
            text-align: right;
          }

          :host([weekend]) {
            color: gray;
          }

          :host([outside-range]) {
            color: lightgray;
          }

          :host([today]) {
            color: darkred;
            font-weight: bold;
          }

          :host([selected]) {
            background: #ddd;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainCalendarDay;
