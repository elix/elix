import { forwardFocus, indexOfItemContainingTarget } from './utilities.js';
import * as calendar from './calendar.js';
import * as internal from './internal.js';
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

const Base = ArrowDirectionMixin(
  CalendarElementMixin(
    DarkModeMixin(
      FocusVisibleMixin(
        FormElementMixin(
          KeyboardDirectionMixin(
            KeyboardMixin(LanguageDirectionMixin(CalendarMonth))
          )
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
      this[internal.raiseChangeEvents] = true;
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
      this[internal.raiseChangeEvents] = false;
    });
    // Any click within this element puts focus on the top-level element.
    forwardFocus(this, this);
  }

  arrowButtonNext() {
    // If we're asked to navigate to the next month, but don't have a date yet,
    // assume the current date.
    const date = this[internal.state].date || calendar.today();
    this[internal.setState]({
      date: calendar.offsetDateByMonths(date, 1)
    });
    return true;
  }

  arrowButtonPrevious() {
    // See note in arrowButtonNext.
    const date = this[internal.state].date || calendar.today();
    this[internal.setState]({
      date: calendar.offsetDateByMonths(date, -1)
    });
    return true;
  }

  get [internal.defaultState]() {
    const result = Object.assign(super[internal.defaultState], {
      arrowButtonOverlap: false,
      canGoNext: true,
      canGoPrevious: true,
      date: calendar.today(),
      dayPartType: CalendarDayButton,
      orientation: 'both',
      showCompleteWeeks: true,
      showSelectedDay: true,
      value: null
    });

    // Reflect any change in date to value as well so that FormElementMixin can
    // update form internals.
    result.onChange('date', state => ({
      value: state.date ? state.date.toString() : ''
    }));

    return result;
  }

  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    let handled = false;

    switch (event.key) {
      case 'Home':
        this[internal.setState]({
          date: calendar.today()
        });
        handled = true;
        break;

      case 'PageDown':
        this[internal.setState]({
          date: calendar.offsetDateByMonths(this[internal.state].date, 1)
        });
        handled = true;
        break;

      case 'PageUp':
        this[internal.setState]({
          date: calendar.offsetDateByMonths(this[internal.state].date, -1)
        });
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  [internal.goDown]() {
    if (super[internal.goDown]) {
      super[internal.goDown]();
    }
    this[internal.setState]({
      date: calendar.offsetDateByDays(this[internal.state].date, 7)
    });
    return true;
  }

  [internal.goLeft]() {
    if (super[internal.goLeft]) {
      super[internal.goLeft]();
    }
    this[internal.setState]({
      date: calendar.offsetDateByDays(this[internal.state].date, -1)
    });
    return true;
  }

  [internal.goRight]() {
    if (super[internal.goRight]) {
      super[internal.goRight]();
    }
    this[internal.setState]({
      date: calendar.offsetDateByDays(this[internal.state].date, 1)
    });
    return true;
  }

  [internal.goUp]() {
    if (super[internal.goUp]) {
      super[internal.goUp]();
    }
    this[internal.setState]({
      date: calendar.offsetDateByDays(this[internal.state].date, -7)
    });
    return true;
  }

  get [internal.template]() {
    const result = super[internal.template];
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
