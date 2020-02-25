import * as internal from "../base/internal.js";
import CalendarDayButton from "../base/CalendarDayButton.js";
import html from "../core/html.js";
import PlainCalendarDay from "./PlainCalendarDay.js";

/**
 * CalendarDayButton component in the Plain reference design system
 *
 * @inherits CalendarDayButton
 * @part {PlainCalendarDay} day
 */
class PlainCalendarDayButton extends CalendarDayButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      dayPartType: PlainCalendarDay
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            border: 1px solid transparent;
          }

          :host(:hover) {
            border-color: gray;
          }

          :host([selected]) {
            background: #ddd;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainCalendarDayButton;
