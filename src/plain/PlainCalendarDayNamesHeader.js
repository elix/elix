import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import CalendarDayNamesHeader from "../base/CalendarDayNamesHeader.js";

/**
 * CalendarDayNamesHeader component in the Plain reference design system
 *
 * @inherits CalendarDayNamesHeader
 */
class PlainCalendarDayNamesHeader extends CalendarDayNamesHeader {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            font-size: smaller;
          }
          
          .dayName {
            padding: 0.3em;
            text-align: center;
            white-space: nowrap;
          }

          .dayName.weekend {
            color: gray;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainCalendarDayNamesHeader;
