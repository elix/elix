import * as internal from "../base/internal.js";
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
}

export default PlainCalendarMonth;
