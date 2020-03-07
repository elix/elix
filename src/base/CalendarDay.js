import { setInternalState } from "../core/dom.js";
import * as calendar from "./calendar.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import CalendarElementMixin from "./CalendarElementMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SelectableMixin from "./SelectableMixin.js";

const Base = CalendarElementMixin(SelectableMixin(ReactiveElement));

/**
 * Calendar representation of a single day.
 *
 * [A default representation of the current day in browser's default locale](/demos/calendarDay.html)
 *
 * Given a reference `date` property, this component will show a calendar
 * representation of that date.
 *
 * [CalendarDays](CalendarDays), and [CalendarMonth](CalendarMonth) instantiate
 * `CalendarDay` as the default component for rendering days.
 *
 * All of the Elix calendar components attempt to provide full
 * [international calendar support](CalendarMonth#international-support)
 * to the extent currently possible in the user's web browser.
 *
 * @inherits ReactiveElement
 * @mixes CalendarElementMixin
 * @mixes SelectableMixin
 * @state alternate-month
 * @state first-day-of-month
 * @state first-week
 * @state friday
 * @state future
 * @state last-day-of-month
 * @state monday
 * @state outside-range
 * @state past
 * @state saturday
 * @state sunday
 * @state thursday
 * @state today
 * @state tuesday
 * @state wednesday
 * @state weekday
 * @state weekend
 */
class CalendarDay extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      date: calendar.today(),
      outsideRange: false
    });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    const { date } = this[internal.state];
    if (changed.date) {
      const today = calendar.today();
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();
      const nextDate = calendar.offsetDateByDays(date, 1);
      const daysFromToday =
        Math.round(date.getTime() - today.getTime()) /
        calendar.millisecondsPerDay;
      setInternalState(
        this,
        "alternate-month",
        Math.abs(date.getMonth() - today.getMonth()) % 2 === 1
      );
      setInternalState(this, "first-day-of-month", dayOfMonth === 1);
      setInternalState(this, "first-week", dayOfMonth <= 7);
      setInternalState(this, "future", date > today);
      setInternalState(
        this,
        "last-day-of-month",
        date.getMonth() !== nextDate.getMonth()
      );
      setInternalState(this, "past", date < today);
      setInternalState(this, "sunday", dayOfWeek === 0);
      setInternalState(this, "monday", dayOfWeek === 1);
      setInternalState(this, "tuesday", dayOfWeek === 2);
      setInternalState(this, "wednesday", dayOfWeek === 3);
      setInternalState(this, "thursday", dayOfWeek === 4);
      setInternalState(this, "friday", dayOfWeek === 5);
      setInternalState(this, "saturday", dayOfWeek === 6);

      setInternalState(this, "today", daysFromToday === 0);
      this[internal.ids].day.textContent = dayOfMonth.toString();
    }

    if (changed.date || changed.locale) {
      const dayOfWeek = date.getDay();
      const { locale } = this[internal.state];
      const weekend =
        dayOfWeek === calendar.weekendStart(locale) ||
        dayOfWeek === calendar.weekendEnd(locale);
      setInternalState(this, "weekday", !weekend);
      setInternalState(this, "weekend", weekend);
    }

    if (changed.outsideRange) {
      setInternalState(
        this,
        "outside-range",
        this[internal.state].outsideRange
      );
    }
  }

  get outsideRange() {
    return this[internal.state].outsideRange;
  }
  set outsideRange(outsideRange) {
    this[internal.setState]({ outsideRange });
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
        }
      </style>
      <div id="day"></div>
    `;
  }
}

export default CalendarDay;
