import './CalendarMonthNavigator.js'
import './SeamlessButton.js';
import { forwardFocus, stateChanged } from './utilities.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ComboBox from './ComboBox.js';


const previousStateKey = Symbol('previousState');


const Base =
  CalendarElementMixin(
    ComboBox
  );

  
class DateComboBox extends Base {

  get calendar() {
    return this.shadowRoot ?
      this.$.calendar :
      null;
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.calendar.addEventListener('date-changed', event => {
      this[symbols.raiseChangeEvents] = true;
      /** @type {any} */
      const cast = event;
      this.date = cast.detail.date;
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.calendar.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
      this.close();
      event.preventDefault(); // Keep focus on input.
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.todayButton.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
      this.date = calendar.today();
      this.close();
      event.preventDefault(); // Keep focus on input.
      this[symbols.raiseChangeEvents] = false;
    });
    if (this.$.todayButton instanceof HTMLElement && this.$.input instanceof HTMLElement) {
      forwardFocus(this.$.todayButton, this.$.input);
    }
    if (this.$.calendar instanceof HTMLElement && this.$.input instanceof HTMLElement) {
      forwardFocus(this.$.calendar, this.$.input);
    }
  }

  get dateTimeFormatOptions() {
    return this.state.dateTimeFormatOptions;
  }
  set dateTimeFormatOptions(dateTimeFormatOptions) {
    this.setState({
      dateTimeFormatOptions
    });
  }

  get date() {
    return super.date;
  }
  set date(date) {
    super.date = date;
    this.setState({
      datePriority: true
    });
  }

  get defaultState() {
    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };
    return Object.assign({}, super.defaultState, {
      date: null,
      datePriority: false,
      dateTimeFormatOptions
    });
  }

  formatDate(date, options) {
    const { locale, dateTimeFormatOptions } = options;
    const dateTimeFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
    return dateTimeFormat.format(date);
  }

  [symbols.goDown]() {
    if (super[symbols.goDown]) { super[symbols.goDown](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, 7)
    });
    return true;
  }

  [symbols.goLeft]() {
    if (super[symbols.goLeft]) { super[symbols.goLeft](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, -1)
    });
    return true;
  }

  [symbols.goRight]() {
    if (super[symbols.goRight]) { super[symbols.goRight](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, 1)
    });
    return true;
  }

  [symbols.goUp]() {
    if (super[symbols.goUp]) { super[symbols.goUp](); }
    const date = this.state.date || new Date();
    this.setState({
      date: calendar.offsetDateByDays(date, -7)
    });
    return true;
  }

  [symbols.keydown](event) {
    let handled = false;

    const date = this.state.date || calendar.today();

    switch (event.key) {

      case 'ArrowDown':
        if (event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goDown]();
        }
        break;

      case 'ArrowLeft':
        if (event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goLeft]();
        }
        break;

      case 'ArrowRight':
        if (event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goRight]();
        }
        break;

      case 'ArrowUp':
        if (event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goUp]();
        }
        break;

      case 'PageDown':
        this.setState({
          date: calendar.offsetDateByMonths(date, 1)
        });
        handled = true;
        break;
        
      case 'PageUp':
        this.setState({
          date: calendar.offsetDateByMonths(date, -1)
        });
        handled = true;
        break;

    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      date: null,
      focused: false,
      locale: null,
      opened: false,
      value: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const {
      date,
      datePriority,
      dateTimeFormatOptions,
      focused,
      locale,
      opened,
      value
    } = state;
    const closing = changed.opened && !opened;
    const blur = changed.focused && !focused;
    if ((changed.date && !focused) || closing || blur ||
        (changed.locale && datePriority)) {
      // Update value from date if the date was changed from the outside, we're
      // closing, losing focus, or the locale is changing and the date was the
      // last substantive property set.
      const formattedDate = date ?
        this.formatDate(date, {
          dateTimeFormatOptions,
          locale
        }) :
        '';
      if (state.value !== formattedDate) {
        state.value = formattedDate;
        state.selectText = formattedDate.length > 0;
        result = false;
      }
    } else if (changed.value || (changed.locale && !datePriority)) {
      // Update date from value if the value was changed, or the locale was
      // changed and the value was the last substantive property set.
      const parsedDate = this.parseDate(value, {
        dateTimeFormatOptions,
        locale
      });
      if (parsedDate && !calendar.datesEqual(state.date, parsedDate)) {
        state.date = parsedDate;
        result = false;
      }
    }
    return result;
  }

  parseDate(text, options) {
    const { locale, dateTimeFormatOptions } = options;
    const dateTimeFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
    return calendar.parseWithOptionalYear(text, dateTimeFormat);
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, DateComboBox, symbols.template);

    // Replace default slot with calendar.
    const calendarTemplate = template.html`
      <style>
        #calendar {
          margin: 0.5em;
        }

        #todayButton {
          border: 1px solid transparent;
          padding: 0.5em;
        }

        #todayButton:hover {
          border-color: gray;
        }
      </style>
      <elix-calendar-month-navigator id="calendar"></elix-calendar-month-navigator>
      <elix-seamless-button id="todayButton">Today</elix-seamless-button>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, calendarTemplate);
    }

    return result;
  }

  get updates() {
    const { date, dateTimeFormatOptions, locale } = this.state;
    return merge(super.updates, {
      $: {
        calendar: Object.assign(
          {
            locale
          },
          date && {
            date
          }
        )
      }
    });
  }

  get value() {
    return super.value;
  }
  set value(value) {
    super.value = value;
    this.setState({
      datePriority: false
    });
  }

}


export default DateComboBox;
customElements.define('elix-date-combo-box', DateComboBox);
