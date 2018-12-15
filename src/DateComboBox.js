import './CalendarMonthNavigator.js'
import './SeamlessButton.js';
import { calendar } from './elix.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import { forwardFocus, stateChanged } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ComboBox from './ComboBox.js';
import DateInput from './DateInput.js';


const previousStateKey = Symbol('previousState');


const Base =
  CalendarElementMixin(
    ComboBox
  );

  
class DateComboBox extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.calendar.addEventListener('date-changed', event => {
      this[symbols.raiseChangeEvents] = true;
      /** @type {any} */
      const cast = event;
      updateDateAndValue(this, cast.detail.date);
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.calendar.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
      this.close();
      event.preventDefault(); // Keep focus on input.
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.input.addEventListener('date-changed', event => {
      this[symbols.raiseChangeEvents] = true;
      /** @type {any} */
      const cast = event.target;
      updateDateAndValue(this, cast.date, cast.value);
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.todayButton.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
      updateDateAndValue(this, calendar.today());
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

  get defaultState() {
    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };
    return Object.assign({}, super.defaultState, {
      date: null,
      dateTimeFormatOptions,
      inputRole: DateInput
    });
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
      locale: null,
      opened: false,
      value: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const { date, opened } = state;
    if ((changed.date || changed.opened) && !opened) {
      // Update value from date if we're closing or date is being changed while
      // we are closed.
      if (date !== null) {
        const formattedDate = formatDate(state, date);
        if (state.value !== formattedDate) {
          state.value = formattedDate;
          state.selectText = true;
          result = false;
        }
      } else if (state.value !== '') {
        state.value = '';
        result = false;
      }
    }
    return result;
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
        ),
        input : {
          dateTimeFormatOptions,
          locale
        }
      }
    });
  }

}


function formatDate(state, date) {
  const dateTimeFormat = calendar.dateTimeFormat(
    state.locale,
    state.dateTimeFormatOptions
  );
  return dateTimeFormat.format(date);
}


function updateDateAndValue(element, date, value) {
  if (value === undefined) {
    value = formatDate(element.state, date);
  }
  if (!calendar.datesEqual(element.state.date, date)) {
    element.setState({
      date,
      value
    });
  }
}


export default DateComboBox;
customElements.define('elix-date-combo-box', DateComboBox);
