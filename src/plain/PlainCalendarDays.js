import CalendarDays from "../base/CalendarDays.js";
import { defaultState } from "../base/internal.js";
import PlainCalendarDay from "./PlainCalendarDay.js";

/**
 * CalendarDays component in the Plain reference design system
 *
 * @inherits CalendarDays
 * @part {PlainCalendarDay} day
 */
class PlainCalendarDays extends CalendarDays {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      dayPartType: PlainCalendarDay,
    });
  }
}

export default PlainCalendarDays;
