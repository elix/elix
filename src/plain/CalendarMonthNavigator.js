import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import CalendarMonthNavigator from "../base/CalendarMonthNavigator.js";
import PlainCalendarDayButton from "./CalendarDayButton.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainCalendarMonthNavigator extends CalendarMonthNavigator {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton,
      dayPartType: PlainCalendarDayButton
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

export default PlainCalendarMonthNavigator;
