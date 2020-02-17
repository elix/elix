import * as internal from "../base/internal.js";
import CalendarDays from "../base/CalendarDays.js";
import PlainCalendarDay from "./PlainCalendarDay.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainCalendarDays extends CalendarDays {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      dayPartType: PlainCalendarDay
    });
  }
}

export default PlainCalendarDays;
