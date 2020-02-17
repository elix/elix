import * as internal from "../base/internal.js";
import CalendarMonthNavigator from "../base/CalendarMonthNavigator.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCalendarDayButton from "./PlainCalendarDayButton.js";
import PlainCalendarDayNamesHeader from "./PlainCalendarDayNamesHeader.js";
import PlainCalendarMonthYearHeader from "./PlainCalendarMonthYearHeader.js";

/**
 * CalendarMonthNavigator component in the Plain reference design system
 *
 * @inherits CalendarMonthNavigator
 * @mixes PlainArrowDirectionMixin
 */
class PlainCalendarMonthNavigator extends PlainArrowDirectionMixin(
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
