import { updateChildNodes } from "../core/dom.js";
import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { createElement } from "../core/template.js";
import * as calendar from "./calendar.js";
import CalendarDay from "./CalendarDay.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  stateEffects,
  template,
} from "./internal.js";

const Base = CalendarElementMixin(ReactiveElement);

/**
 * A 7-column grid of days for use in a month calendar or multi-week calendar.
 *
 * [A default representation of days in the current month in browser's default locale](/demos/calendarMonth.html)
 *
 * Given a `startDate` and `dayCount`, this component will show a calendar
 * representation of that many days starting from the indicated date.
 * [CalendarMonth](CalendarMonth) uses `CalendarDays` to render the days portion
 * of the month, to which it adds headers for the month/year and the days of the
 * week.
 *
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
 *
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @part {CalendarDay} day - any of the day elements in the grid
 * @part {div} day-container - container for the days
 */
class CalendarDays extends Base {
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "start-date") {
      this.startDate = new Date(newValue);
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  /**
   * Returns the day element corresponding to the given date, or null if the
   * date falls outside this calendar week.
   *
   * @param {Date} date - the date to search for
   */
  dayElementForDate(date) {
    /** @type {Element[]} */ const days = this.days || [];
    return days.find((day) => {
      /** @type {any} */ const cast = day;
      return calendar.datesEqual(cast.date, date);
    });
  }

  get dayCount() {
    return this[state].dayCount;
  }
  set dayCount(dayCount) {
    this[setState]({ dayCount });
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

  /**
   * The elements for the days being displayed.
   *
   * @type {Element[]|null}
   */
  get days() {
    return this[state].days;
  }

  // @ts-ignore
  get [defaultState]() {
    const today = calendar.today();
    return Object.assign(super[defaultState], {
      date: today,
      dayCount: 1,
      dayPartType: CalendarDay,
      days: null,
      showCompleteWeeks: false,
      showSelectedDay: false,
      startDate: today,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.days) {
      updateChildNodes(this[ids].dayContainer, this[state].days);
    }
    if (changed.date || changed.locale || changed.showSelectedDay) {
      // Ensure only current date has "selected" class.
      const showSelectedDay = this[state].showSelectedDay;
      const { date } = this[state];
      const selectedDate = date.getDate();
      const selectedMonth = date.getMonth();
      const selectedYear = date.getFullYear();
      /** @type {Element[]} */ const days = this.days || [];
      days.forEach((day) => {
        const dayDate = /** @type {any} */ (day).date;
        const selected =
          showSelectedDay &&
          dayDate.getDate() === selectedDate &&
          dayDate.getMonth() === selectedMonth &&
          dayDate.getFullYear() === selectedYear;
        day.toggleAttribute("selected", selected);
      });
    }
    if (changed.dayCount || changed.startDate) {
      // Mark dates as inside or outside of range.
      const { dayCount, startDate } = this[state];
      const firstDateAfterRange = calendar.offsetDateByDays(
        startDate,
        dayCount
      );
      /** @type {any[]} */
      const days = this[state].days || [];
      days.forEach((day) => {
        if ("outsideRange" in day) {
          const dayDate = day.date;
          const dayTime = dayDate.getTime();
          const outsideRange =
            dayTime < startDate.getTime() ||
            dayTime >= firstDateAfterRange.getTime();
          day.outsideRange = outsideRange;
        }
      });
    }
  }

  get showCompleteWeeks() {
    return this[state].showCompleteWeeks;
  }
  set showCompleteWeeks(showCompleteWeeks) {
    this[setState]({ showCompleteWeeks });
  }

  get showSelectedDay() {
    return this[state].showSelectedDay;
  }
  set showSelectedDay(showSelectedDay) {
    this[setState]({ showSelectedDay });
  }

  get startDate() {
    return this[state].startDate;
  }
  set startDate(startDate) {
    if (!calendar.datesEqual(this[state].startDate, startDate)) {
      this[setState]({ startDate });
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // If any date-related state changes, regenerate the set of days.
    if (
      changed.dayCount ||
      changed.dayPartType ||
      changed.locale ||
      changed.showCompleteWeeks ||
      changed.startDate
    ) {
      const days = updateDays(state, changed.dayPartType);
      Object.assign(effects, { days });
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-block;
        }

        [part~="day-container"] {
          direction: ltr;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
      </style>

      <div id="dayContainer" part="day-container"></div>
    `;
  }
}

/**
 * Create days as necessary for the given state.
 * Reuse existing day elements to the degree possible.
 *
 * @private
 * @param {PlainObject} state
 * @param {boolean} forceCreation
 */
function updateDays(state, forceCreation) {
  const { dayCount, dayPartType, locale, showCompleteWeeks, startDate } = state;
  const workingStartDate = showCompleteWeeks
    ? calendar.firstDateOfWeek(startDate, locale)
    : calendar.midnightOnDate(startDate);
  let workingDayCount;
  if (showCompleteWeeks) {
    const endDate = calendar.offsetDateByDays(startDate, dayCount - 1);
    const workingEndDate = calendar.lastDateOfWeek(endDate, locale);
    workingDayCount =
      calendar.daysBetweenDates(workingStartDate, workingEndDate) + 1;
  } else {
    workingDayCount = dayCount;
  }

  let days = state.days ? state.days.slice() : [];

  let date = workingStartDate;
  for (let i = 0; i < workingDayCount; i++) {
    const createNewElement = forceCreation || i >= days.length;
    const day = createNewElement ? createElement(dayPartType) : days[i];
    day.date = new Date(date.getTime());
    day.locale = locale;
    if ("part" in day) {
      day.part = "day";
    }
    day.style.gridColumnStart = "";
    if (createNewElement) {
      days[i] = day;
    }
    date = calendar.offsetDateByDays(date, 1);
  }

  if (workingDayCount < days.length) {
    // Trim days which are no longer needed.
    days = days.slice(0, workingDayCount);
  }

  const firstDay = days[0];
  if (firstDay && !showCompleteWeeks) {
    // Set the grid-column on the first day. This will cause all the subsequent
    // days to line up in the calendar grid.
    const dayOfWeek = calendar.daysSinceFirstDayOfWeek(
      firstDay.date,
      state.locale
    );
    firstDay.style.gridColumnStart = dayOfWeek + 1;
  }

  Object.freeze(days);
  return days;
}

export default CalendarDays;
