import * as internal from "../base/internal.js";
import CalendarMonth from "../base/CalendarMonth.js";
import PlainCalendarDay from "./PlainCalendarDay.js";
import PlainCalendarDayNamesHeader from "./PlainCalendarDayNamesHeader.js";
import PlainCalendarMonthYearHeader from "./PlainCalendarMonthYearHeader.js";

/**
 * CalendarMonth component in the Plain reference design system
 *
 * @inherits CalendarMonth
 */
class PlainCalendarMonth extends CalendarMonth {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      dayNamesHeaderPartType: PlainCalendarDayNamesHeader,
      dayPartType: PlainCalendarDay,
      monthYearHeaderPartType: PlainCalendarMonthYearHeader
    });
  }
}

export default PlainCalendarMonth;
