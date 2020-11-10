import CalendarMonth from "../base/CalendarMonth.js";
import { defaultState } from "../base/internal.js";
import PlainCalendarDay from "./PlainCalendarDay.js";
import PlainCalendarDayNamesHeader from "./PlainCalendarDayNamesHeader.js";
import PlainCalendarMonthYearHeader from "./PlainCalendarMonthYearHeader.js";

/**
 * CalendarMonth component in the Plain reference design system
 *
 * @inherits CalendarMonth
 * @part {PlainCalendarDayNamesHeader} day-names-header
 * @part {PlainCalendarDay} day
 * @part {PlainCalendarMonthYearHeader} month-year-header
 */
class PlainCalendarMonth extends CalendarMonth {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      dayNamesHeaderPartType: PlainCalendarDayNamesHeader,
      dayPartType: PlainCalendarDay,
      monthYearHeaderPartType: PlainCalendarMonthYearHeader,
    });
  }
}

export default PlainCalendarMonth;
