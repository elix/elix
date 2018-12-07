import './CalendarMonth.js';
import { html } from './template.js';
import { indexOfItemContainingTarget } from './utilities.js';
import { merge } from './updates.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import CalendarDayButton from './CalendarDayButton.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
    ReactiveElement
  ))));


class CalendarMonthNavigator extends Base {

  constructor() {
    super();
    this.addEventListener('mousedown', event => {
      const target = event.composedPath()[0];
      const days = this.days;
      const index = indexOfItemContainingTarget(days, target);
      const day = days[index];
      if (day) {
        const date = day.date;
        this.setState({
          date
        });
      }
    });
  }

  get days() {
    return this.shadowRoot ?
      this.$.calendar.days :
      [];
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dayRole: CalendarDayButton,
      orientation: 'horizontal'
    });
  }

  selectNext() {
    if (super.selectNext) { super.selectNext(); }
    const date = calendar.offsetDateByMonths(this.state.date, 1);
    this.setState({
      date
    });
  }

  selectPrevious() {
    if (super.selectPrevious) { super.selectPrevious(); }
    const date = calendar.offsetDateByMonths(this.state.date, -1);
    this.setState({
      date
    });
  }

  get [symbols.template]() {
    return html`
      <elix-calendar-month id="calendar"></elix-calendar-month>
    `;
  }

  get updates() {
    const { date, dayRole } = this.state;
    return merge(super.updates, {
      $: {
        calendar: {
          date,
          dayRole
        }
      }
    });
  }

}


export default CalendarMonthNavigator;
customElements.define('elix-calendar-month-navigator', CalendarMonthNavigator);
