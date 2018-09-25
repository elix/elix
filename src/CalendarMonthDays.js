import './CalendarWeek.js';
import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as calendar from './calendar.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';


class CalendarMonthDays extends ReactiveElement {

  get date() {
    return this.state.date;
  }
  set date(date) {
    this.setState({ date });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      date: new Date,
      locale: navigator.language
    });
  }

  /**
   * The date of the first day in the month.
   *
   * Note that there may be days from the previous month that appear (or are
   * hidden) before this first day of the month.
   *
   * @property firstDateOfMonth
   */
  get firstDateOfMonth() {
    const date = calendar.midnightOnDate(this.date);
    date.setDate(1);
    return date;
  }

  /**
   * Returns true if the given date is in the month shown.
   *
   * @param date
   */
  isDateInMonth(date) {
    const firstDateOfNextMonth = calendar.offsetDateByDays(this.lastDateOfMonth, 1);
    return (date >= this.firstDateOfMonth && date < firstDateOfNextMonth);
  }

  /**
   * The date of the last day in the month.
   *
   * Note that there may be days from the next month that appear (or are hidden)
   * after this last day of the month.
   *
   * @property lastDateOfMonth
   */
  get lastDateOfMonth() {
    // Get last day of month by going to first day of next month and backing up a day.
    const date = this.firstDateOfMonth;
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);
    return date;
  }

  get locale() {
    return this.state.locale;
  }
  set locale(locale) {
    this.setState({ locale });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: table-row-group;
        }

        basic-calendar-week.outsideMonth {
          display: none;
        }
        
        /* TODO: How to replace deprecated use of ::shadow?
        basic-calendar-week::shadow .day.outsideMonth {
          visibility: hidden;
        }
        */
      </style>

      <elix-calendar-week id="week0"></elix-calendar-week>
      <elix-calendar-week id="week1"></elix-calendar-week>
      <elix-calendar-week id="week2"></elix-calendar-week>
      <elix-calendar-week id="week3"></elix-calendar-week>
      <elix-calendar-week id="week4"></elix-calendar-week>
      <elix-calendar-week id="week5"></elix-calendar-week>
    `;
  }

  get updates() {
    const locale = this.state.locale;
    const firstDateOfMonth = this.firstDateOfMonth;
    // const month = firstDateOfMonth.getMonth();
    const weekUpdates = {};
    for (let i = 0; i <= 5; i++) {
      const referenceDate = calendar.offsetDateByDays(firstDateOfMonth, 7 * i);
      // For the first week of the month, use the first of the month as the
      // reference date of that week. For subsequent weeks, use the first of
      // the given week.
      const date = (i === 0)
        ? referenceDate
        : calendar.firstDateOfWeek(referenceDate, locale);
      // Hide weeks completely in another month (i.e., the next month).
      // Apply "hidden" class to preserve week's original "display" property.
      // const lastDateOfWeek = this.offsetDateByDays(firstDateOfWeek, 6);
      // const isWeekInMonth = (firstDateOfWeek.getMonth() === month || lastDateOfWeek.getMonth() === month);
      // week.classList.toggle('outsideMonth', !isWeekInMonth);
      weekUpdates[`week${i}`] = {
        date,
        locale
      };
    }

    return merge(super.updates, {
      $: weekUpdates
    });
  }

  get weeks() {
    return this.shadowRoot ?
      [
        this.$.week0,
        this.$.week1,
        this.$.week2,
        this.$.week3,
        this.$.week4,
        this.$.week5
      ] :
      null;
  }

}


export default CalendarMonthDays;
customElements.define('elix-calendar-month-days', CalendarMonthDays);
