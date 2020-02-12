import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import CalendarMonth from "../base/CalendarMonth.js";
import PlainCalendarDay from "./CalendarDay.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainCalendarMonth extends CalendarMonth {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      dayPartType: PlainCalendarDay
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #monthYearHeader {
            font-size: larger;
            font-weight: bold;
            padding: 0.3em;
          }

          #dayNamesHeader {
            font-size: smaller;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainCalendarMonth;
