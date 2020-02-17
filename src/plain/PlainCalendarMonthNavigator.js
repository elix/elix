import * as internal from "../base/internal.js";
import CalendarMonthNavigator from "../base/CalendarMonthNavigator.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionIconsMixin from "./PlainArrowDirectionMixin.js";
import PlainCalendarDayButton from "./PlainCalendarDayButton.js";
import PlainCalendarDayNamesHeader from "./PlainCalendarDayNamesHeader.js";
import PlainCalendarMonthYearHeader from "./PlainCalendarMonthYearHeader.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainCalendarMonthNavigator extends PlainArrowDirectionIconsMixin(
  CalendarMonthNavigator
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
      dayNamesHeaderPartType: PlainCalendarDayNamesHeader,
      dayPartType: PlainCalendarDayButton,
      monthYearHeaderPartType: PlainCalendarMonthYearHeader
    });
  }
}

export default PlainCalendarMonthNavigator;
