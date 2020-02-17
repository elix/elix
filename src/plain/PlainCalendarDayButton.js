import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import CalendarDayButton from "../base/CalendarDayButton.js";
import PlainCalendarDay from "./PlainCalendarDay.js";

class PlainCalendarDayButton extends CalendarDayButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      dayPartType: PlainCalendarDay
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
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
      `.content
    );
    return result;
  }
}

export default PlainCalendarDayButton;
