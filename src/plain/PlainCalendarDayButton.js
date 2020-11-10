import CalendarDayButton from "../base/CalendarDayButton.js";
import { defaultState, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainCalendarDay from "./PlainCalendarDay.js";

/**
 * CalendarDayButton component in the Plain reference design system
 *
 * @inherits CalendarDayButton
 * @part {PlainCalendarDay} day
 */
class PlainCalendarDayButton extends CalendarDayButton {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      dayPartType: PlainCalendarDay,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
