import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import DateComboBox from "../base/DateComboBox.js";
import PlainButton from "./Button.js";
import PlainCalendarMonthNavigator from "./CalendarMonthNavigator.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";

class PlainDateComboBox extends PlainComboBoxMixin(DateComboBox) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      calendarPartType: PlainCalendarMonthNavigator,
      todayButtonPartType: PlainButton
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            width: 8em;
          }

          #calendar {
            margin: 0.5em;
          }

          #todayButton {
            border: 1px solid transparent;
            padding: 0.5em;
          }

          #todayButton:hover {
            border-color: gray;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainDateComboBox;
