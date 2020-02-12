import * as internal from "../base/internal.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import CalendarMonthNavigator from "../base/CalendarMonthNavigator.js";
import PlainCalendarDayButton from "./CalendarDayButton.js";
import PlainCalendarDayNamesHeader from "./CalendarDayNamesHeader.js";
import PlainCalendarMonthYearHeader from "./CalendarMonthYearHeader.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainCalendarMonthNavigator extends CalendarMonthNavigator {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton,
      dayNamesHeaderPartType: PlainCalendarDayNamesHeader,
      dayPartType: PlainCalendarDayButton,
      monthYearHeaderPartType: PlainCalendarMonthYearHeader
    });
  }
}

export default PlainCalendarMonthNavigator;
