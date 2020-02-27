import * as internal from "../base/internal.js";
import CalendarDayNamesHeader from "../base/CalendarDayNamesHeader.js";
import html from "../core/html.js";

/**
 * CalendarDayNamesHeader component in the Plain reference design system
 *
 * @inherits CalendarDayNamesHeader
 */
class PlainCalendarDayNamesHeader extends CalendarDayNamesHeader {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
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
