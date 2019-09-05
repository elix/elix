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
import FormElementMixin from './FormElementMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';


const Base =
  ArrowDirectionMixin(
  CalendarElementMixin(
  DarkModeMixin(
  FocusVisibleMixin(
  FormElementMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
    CalendarMonth
  ))))))));


/**
 * Interactive month calendar that lets the user select a date
 * 
 * @inherits CalendarMonth
 * @mixes ArrowDirectionMixin
 * @mixes CalendarElementMixin
 * @mixes DarkModeMixin
 * @mixes FocusVisibleMixin
 * @mixes FormElementMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
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

  arrowButtonNext() {
    this.setState({
      date: calendar.offsetDateByMonths(this.state.date, 1)
    });
    return true;
  }

  arrowButtonPrevious() {
    this.setState({
      date: calendar.offsetDateByMonths(this.state.date, -1)
    });
    return true;
  }

  get [symbols.defaultState]() {
    const result = Object.assign(super[symbols.defaultState], {
      arrowButtonOverlap: false,
      canGoNext: true,
      canGoPrevious: true,
      date: calendar.today(),
      dayRole: CalendarDayButton,
      orientation: 'both',
      showCompleteWeeks: true,
      showSelectedDay: true,
      value: null
    });

    // Reflect any change in date to value as well so that FormElementMixin can
    // update form internals.
    result.onChange('date', state => ({
      value: state.date ?
        state.date.toString() :
        ''
    }));

    return result;
  }

    [symbols.keydown](/** @type {KeyboardEvent} */ event) {
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
    return true;
  }

  [symbols.goLeft]() {
    if (super[symbols.goLeft]) { super[symbols.goLeft](); }
    this.setState({
      date: calendar.offsetDateByDays(this.state.date, -1)
    });
    return true;
  }

  [symbols.goRight]() {
    if (super[symbols.goRight]) { super[symbols.goRight](); }
    this.setState({
      date: calendar.offsetDateByDays(this.state.date, 1)
    });
    return true;
  }

  [symbols.goUp]() {
    if (super[symbols.goUp]) { super[symbols.goUp](); }
    this.setState({
      date: calendar.offsetDateByDays(this.state.date, -7)
    });
    return true;
  }

  get [symbols.template]() {
    const result = super[symbols.template];
    const monthYearHeader = result.content.querySelector('#monthYearHeader');
    /** @type {any} */ const cast = this;
    cast[ArrowDirectionMixin.wrap](monthYearHeader);

    const styleTemplate = template.html`
      <style>
        #arrowIconNext,
        #arrowIconPrevious {
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
customElements.define('elix-calendar-month-navigator', CalendarMonthNavigator);
