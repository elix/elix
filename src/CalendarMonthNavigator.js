import { forwardFocus, indexOfItemContainingTarget } from './utilities.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import CalendarDayButton from './CalendarDayButton.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import CalendarMonth from './CalendarMonth.js';
import DarkModeMixin from './DarkModeMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';


const Base =
  ArrowDirectionMixin(
  CalendarElementMixin(
  DarkModeMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
    CalendarMonth
  )))))));


/**
 * Interactive month calendar that lets the user select a date
 * 
 * @inherits CalendarMonth
 * @mixes ArrowDirectionMixin
 * @mixes CalendarElementMixin
 * @mixes DarkModeMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 */
class CalendarMonthNavigator extends Base {

  constructor() {
    super();
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
    // Any click within this element puts focus on the top-level element.
    forwardFocus(this, this);
  }

  arrowButtonLeft() {
    const months = this.state.rightToLeft ? 1 : -1;
    this.setState({
      date: calendar.offsetDateByMonths(this.state.date, months)
    });
    return true;
  }

  arrowButtonRight() {
    const months = this.state.rightToLeft ? -1 : 1;
    this.setState({
      date: calendar.offsetDateByMonths(this.state.date, months)
    });
    return true;
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      arrowButtonOverlap: false,
      canGoLeft: true,
      canGoRight: true,
      date: calendar.today(),
      dayRole: CalendarDayButton,
      orientation: 'both',
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
    const result = super[symbols.template];
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

}


export default CalendarMonthNavigator;
customElements.define('elix-calendar-month-navigator', CalendarMonthNavigator);
