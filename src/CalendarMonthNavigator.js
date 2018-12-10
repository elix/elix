import './CalendarMonth.js';
import { html } from './template.js';
import { indexOfItemContainingTarget } from './utilities.js';
import { merge } from './updates.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import CalendarDayButton from './CalendarDayButton.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
    ReactiveElement
  )));


class CalendarMonthNavigator extends Base {

  constructor() {
    super();
    this.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
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
      this[symbols.raiseChangeEvents] = false;
    });
  }

  get days() {
    return this.shadowRoot ?
      this.$.calendar.days :
      [];
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dayRole: CalendarDayButton
    });
  }

  [symbols.keydown](event) {
    let handled = false;

    switch (event.key) {

      case 'Home':
        this.setState({
          date: calendar.today()
        });
        handled = true;
        break;

      case 'PageDown':
        this.setState({
          date: calendar.offsetDateByMonths(this.state.date, 1)
        });
        handled = true;
        break;
        
      case 'PageUp':
        this.setState({
          date: calendar.offsetDateByMonths(this.state.date, -1)
        });
        handled = true;
        break;

    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  [symbols.goDown]() {
    if (super[symbols.goDown]) { super[symbols.goDown](); }
    this.setState({
      date: calendar.offsetDateByDays(this.state.date, 7)
    });
  }

  [symbols.goLeft]() {
    if (super[symbols.goLeft]) { super[symbols.goLeft](); }
    this.setState({
      date: calendar.offsetDateByDays(this.state.date, -1)
    });
  }

  [symbols.goRight]() {
    if (super[symbols.goRight]) { super[symbols.goRight](); }
    this.setState({
      date: calendar.offsetDateByDays(this.state.date, 1)
    });
  }

  [symbols.goUp]() {
    if (super[symbols.goUp]) { super[symbols.goUp](); }
    this.setState({
      date: calendar.offsetDateByDays(this.state.date, -7)
    });
  }

  get [symbols.template]() {
    return html`
      <elix-calendar-month id="calendar"></elix-calendar-month>
    `;
  }

  get updates() {
    const { date, dayRole, locale } = this.state;
    return merge(super.updates, {
      $: {
        calendar: {
          date,
          dayRole,
          locale
        }
      }
    });
  }

}


export default CalendarMonthNavigator;
customElements.define('elix-calendar-month-navigator', CalendarMonthNavigator);
