import { getSuperProperty } from './workarounds.js';
import { indexOfItemContainingTarget } from './utilities.js';
import { merge } from './updates.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import CalendarDayButton from './CalendarDayButton.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import CalendarMonth from './CalendarMonth.js';
import ComposedFocusMixin from './ComposedFocusMixin.js';
import DarkModeMixin from './DarkModeMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';


const Base =
  ArrowDirectionMixin(
  CalendarElementMixin(
  ComposedFocusMixin(
  DarkModeMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
    CalendarMonth
  ))))));


/**
 * Interactive month calendar that lets the user select a date
 * 
 * @inherits CalendarMonth
 * @mixes ArrowDirectionMixin
 * @mixes CalendarElementMixin
 * @mixes ComposedFocusMixin
 * @mixes DarkModeMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 */
class CalendarMonthNavigator extends Base {

  constructor() {
    super();
    this[symbols.renderedRoles] = super[symbols.renderedRoles] || {};
    this.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
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
      this[symbols.raiseChangeEvents] = false;
    });
  }

  arrowButtonLeft() {
    this.setState({
      date: calendar.offsetDateByMonths(this.state.date, -1)
    });
    return true;
  }

  arrowButtonRight() {
    this.setState({
      date: calendar.offsetDateByMonths(this.state.date, 1)
    });
    return true;
  }

  get [symbols.canGoLeft]() {
    return true;
  }

  get [symbols.canGoRight]() {
    return true;
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      date: calendar.today(),
      dayRole: CalendarDayButton,
      orientation: 'both',
      overlayArrowButtons: false,
      showCompleteWeeks: true,
      showSelectedDay: true
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
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CalendarMonthNavigator, symbols.template);
    const monthYearHeader = result.content.querySelector('#monthYearHeader');
    this[ArrowDirectionMixin.wrap](monthYearHeader);

    const styleTemplate = template.html`
      <style>
        #arrowIconLeft,
        #arrowIconRight {
          font-size: 24px;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);

    return result;
  }

  get updates() {
    const darkMode = this.state.darkMode;
    const supportsDarkMode = 'darkMode' in this.$.arrowButtonLeft;
    const arrowButtonUpdates = supportsDarkMode ?
      {
        darkMode
      } : 
      {};
    return merge(super.updates, {
      $: {
        arrowButtonLeft: arrowButtonUpdates,
        arrowButtonRight: arrowButtonUpdates
      }
    });
  }

}


export default CalendarMonthNavigator;
customElements.define('elix-calendar-month-navigator', CalendarMonthNavigator);
