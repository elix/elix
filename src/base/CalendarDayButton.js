import { fragmentFrom } from "../core/htmlLiterals.js";
import { createElement, transmute } from "../core/template.js";
import * as calendar from "./calendar.js";
import CalendarDay from "./CalendarDay.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "./internal.js";
import SelectableButton from "./SelectableButton.js";

const Base = CalendarElementMixin(SelectableButton);

/**
 * A selectable day button in an interactive calendar.
 *
 * @inherits SelectableButton
 * @mixes CalendarElementMixin
 * @part {CalendarDay} day - the day shown in the button
 */
class CalendarDayButton extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      date: calendar.today(),
      dayPartType: CalendarDay,
      outsideRange: false,
      tabIndex: -1,
    });
  }

  /**
   * The class or tag used to create the `day` parts – the set of
   * days shown in the calendar grid.
   *
   * @type {PartDescriptor}
   * @default CalendarDay
   */
  get dayPartType() {
    return this[state].dayPartType;
  }
  set dayPartType(dayPartType) {
    this[setState]({ dayPartType });
  }

  get outsideRange() {
    return this[state].outsideRange;
  }
  set outsideRange(outsideRange) {
    this[setState]({ outsideRange });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (changed.dayPartType) {
      const { dayPartType } = this[state];
      transmute(this[ids].day, dayPartType);
    }

    /** @type {any} */ const day = this[ids].day;
    if (changed.dayPartType || changed.date) {
      day.date = this[state].date;
    }

    if (changed.dayPartType || changed.locale) {
      day.locale = this[state].locale;
    }

    if (changed.dayPartType || changed.outsideRange) {
      day.outsideRange = this[state].outsideRange;
    }

    if (changed.dayPartType || changed.selected) {
      // Reflect selected state to inner CalendarDay.
      day.selected = this[state].selected;
    }
  }

  get [template]() {
    const result = super[template];

    // Replace default slot with calendar day.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      const dayPartType = this[state].dayPartType;
      const day = createElement(dayPartType);
      day.id = "day";
      defaultSlot.replaceWith(day);
    }

    // Style outer button.
    result.content.appendChild(
      fragmentFrom.html`
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
