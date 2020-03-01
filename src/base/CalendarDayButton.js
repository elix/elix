import * as calendar from "./calendar.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import CalendarDay from "./CalendarDay.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import html from "../core/html.js";
import SelectableButton from "./SelectableButton.js";

const Base = CalendarElementMixin(SelectableButton);

/**
 * A selectable day button in an interactive calendar.
 *
 * @inherits SelectableButton
 * @part {CalendarDay} day - the day shown in the button
 */
class CalendarDayButton extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      date: calendar.today(),
      dayPartType: CalendarDay,
      outsideRange: false,
      tabIndex: -1
    });
  }

  /**
   * The class, tag, or template used to create the `day` parts – the set of
   * days shown in the calendar grid.
   *
   * @type {PartDescriptor}
   * @default CalendarDay
   */
  get dayPartType() {
    return this[internal.state].dayPartType;
  }
  set dayPartType(dayPartType) {
    this[internal.setState]({ dayPartType });
  }

  get outsideRange() {
    return this[internal.state].outsideRange;
  }
  set outsideRange(outsideRange) {
    this[internal.setState]({ outsideRange });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.dayPartType) {
      const { dayPartType } = this[internal.state];
      template.transmute(this[internal.ids].day, dayPartType);
    }
    /** @type {any} */ const day = this[internal.ids].day;
    if (changed.dayPartType || changed.date) {
      day.date = this[internal.state].date;
    }
    if (changed.dayPartType || changed.locale) {
      day.locale = this[internal.state].locale;
    }
    if (changed.dayPartType || changed.outsideRange) {
      day.outsideRange = this[internal.state].outsideRange;
    }
    if (changed.dayPartType || changed.selected) {
      // Reflect selected state to inner CalendarDay.
      day.selected = this[internal.state].selected;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Replace default slot with calendar day.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      const dayTemplate = document.createElement("template");
      const day = new CalendarDay();
      day.id = "day";
      dayTemplate.content.append(day);
      template.transmute(defaultSlot, dayTemplate);
    }

    // Style outer button.
    result.content.appendChild(
      html`
        <style>
          [part~="day"] {
            width: 100%;
          }
        </style>
      `
    );

    return result;
  }
}

export default CalendarDayButton;
