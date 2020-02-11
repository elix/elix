import * as internal from "../base/internal.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import CalendarMonthNavigator from "../base/CalendarMonthNavigator.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainCalendarMonthNavigator extends CalendarMonthNavigator {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton
    });
  }
}

export default PlainCalendarMonthNavigator;
