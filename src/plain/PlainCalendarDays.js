import * as internal from "../base/internal.js";
import CalendarDays from "../base/CalendarDays.js";
import PlainCalendarDay from "./PlainCalendarDay.js";

/**
 * CalendarDays component in the Plain reference design system
 *
 * @inherits CalendarDays
 * @part {PlainCalendarDay} day
 */
class PlainCalendarDays extends CalendarDays {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      dayPartType: PlainCalendarDay
    });
  }
}

export default PlainCalendarDays;
