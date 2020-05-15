import { forwardFocus, indexOfItemContainingTarget } from "../core/dom.js";
import { templateFrom } from "../core/htmlLiterals.js";
import ArrowDirectionMixin from "./ArrowDirectionMixin.js";
import * as calendar from "./calendar.js";
import CalendarDayButton from "./CalendarDayButton.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import CalendarMonth from "./CalendarMonth.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import {
  defaultState,
  goDown,
  goLeft,
  goRight,
  goUp,
  keydown,
  raiseChangeEvents,
  setState,
  state,
  stateEffects,
  template,
} from "./internal.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";

const Base = ArrowDirectionMixin(
  CalendarElementMixin(
    FocusVisibleMixin(
      FormElementMixin(
        KeyboardDirectionMixin(
          KeyboardMixin(LanguageDirectionMixin(CalendarMonth))
        )
      )
    )
  )
);

/**
 * Interactive month calendar that lets the user select a date
 *
 * @inherits CalendarMonth
 * @mixes ArrowDirectionMixin
 * @mixes CalendarElementMixin
 * @mixes FocusVisibleMixin
 * @mixes FormElementMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 */
class CalendarMonthNavigator extends Base {
  constructor() {
    super();
    this.addEventListener("mousedown", (event) => {
      // Only process events for the main (usually left) button.
      if (event.button !== 0) {
        return;
      }
      this[raiseChangeEvents] = true;
      const target = event.composedPath()[0];
      if (target instanceof Node) {
        const days = this.days;
        const index = indexOfItemContainingTarget(days, target);
        /** @type {any} */
        const day = days[index];
        if (day) {
          this.date = day.date;
        }
      }
      this[raiseChangeEvents] = false;
    });
    // Any click within this element puts focus on the top-level element.
    forwardFocus(this, this);
  }

  arrowButtonNext() {
    // If we're asked to navigate to the next month, but don't have a date yet,
    // assume the current date.
    const date = this[state].date || calendar.today();
    this[setState]({
      date: calendar.offsetDateByMonths(date, 1),
    });
    return true;
  }

  arrowButtonPrevious() {
    // See note in arrowButtonNext.
    const date = this[state].date || calendar.today();
    this[setState]({
      date: calendar.offsetDateByMonths(date, -1),
    });
    return true;
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      arrowButtonOverlap: false,
      canGoNext: true,
      canGoPrevious: true,
      date: calendar.today(),
      dayPartType: CalendarDayButton,
      orientation: "both",
      showCompleteWeeks: true,
      showSelectedDay: true,
      value: null,
    });
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled = false;

    switch (event.key) {
      case "Home":
        this[setState]({
          date: calendar.today(),
        });
        handled = true;
        break;

      case "PageDown":
        this[setState]({
          date: calendar.offsetDateByMonths(this[state].date, 1),
        });
        handled = true;
        break;

      case "PageUp":
        this[setState]({
          date: calendar.offsetDateByMonths(this[state].date, -1),
        });
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  [goDown]() {
    if (super[goDown]) {
      super[goDown]();
    }
    this[setState]({
      date: calendar.offsetDateByDays(this[state].date, 7),
    });
    return true;
  }

  [goLeft]() {
    if (super[goLeft]) {
      super[goLeft]();
    }
    this[setState]({
      date: calendar.offsetDateByDays(this[state].date, -1),
    });
    return true;
  }

  [goRight]() {
    if (super[goRight]) {
      super[goRight]();
    }
    this[setState]({
      date: calendar.offsetDateByDays(this[state].date, 1),
    });
    return true;
  }

  [goUp]() {
    if (super[goUp]) {
      super[goUp]();
    }
    this[setState]({
      date: calendar.offsetDateByDays(this[state].date, -7),
    });
    return true;
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // Reflect any change in date to value as well so that FormElementMixin can
    // update form internals.
    if (changed.date) {
      Object.assign(effects, {
        value: state.date ? state.date.toString() : "",
      });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];
    const monthYearHeader = result.content.querySelector("#monthYearHeader");
    /** @type {any} */ const cast = this;
    cast[ArrowDirectionMixin.wrap](monthYearHeader);

    const styleTemplate = templateFrom.html`
      <style>
        [part~="arrow-icon"] {
          font-size: 24px;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);

    return result;
  }

  // Expose `value` as a synonym for `date` for use in forms.
  get value() {
    return this.date;
  }
  set value(value) {
    this.date = value;
  }
}

export default CalendarMonthNavigator;
