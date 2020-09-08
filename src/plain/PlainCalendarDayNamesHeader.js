import CalendarDayNamesHeader from "../base/CalendarDayNamesHeader.js";
import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * CalendarDayNamesHeader component in the Plain reference design system
 *
 * @inherits CalendarDayNamesHeader
 */
class PlainCalendarDayNamesHeader extends CalendarDayNamesHeader {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            font-size: smaller;
          }

          [part~="day-name"] {
            padding: 0.3em;
            text-align: center;
            white-space: nowrap;
          }

          [weekend] {
            color: gray;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainCalendarDayNamesHeader;
