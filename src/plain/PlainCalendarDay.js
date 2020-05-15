import CalendarDay from "../base/CalendarDay.js";
import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * CalendarDay component in the Plain reference design system
 *
 * @inherits CalendarDay
 */
class PlainCalendarDay extends CalendarDay {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
