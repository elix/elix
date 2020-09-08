import DateComboBox from "../base/DateComboBox.js";
import { defaultState, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainButton from "./PlainButton.js";
import PlainCalendarMonthNavigator from "./PlainCalendarMonthNavigator.js";
import PlainComboBoxMixin from "./PlainComboBoxMixin.js";

/**
 * DateComboBox component in the Plain reference design system
 *
 * @inherits DateComboBox
 * @part {PlainCalendarMonthNavigator} calendar
 * @part {PlainButton} today-button
 */
class PlainDateComboBox extends PlainComboBoxMixin(DateComboBox) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      calendarPartType: PlainCalendarMonthNavigator,
      todayButtonPartType: PlainButton,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            width: 8em;
          }

          [part~=calendar] {
            margin: 0.5em;
          }

          [part~=today-button] {
            border: 1px solid transparent;
            box-sizing: border-box;
            padding: 0.5em;
          }

          [part~=today-button]:hover {
            border-color: gray;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainDateComboBox;
