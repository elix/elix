import './CalendarMonthNavigator.js'
import './SeamlessButton.js';
import { calendar } from './elix.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import { stateChanged } from './utilities.js';
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

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    this.$.calendar.addEventListener('date-changed', event => {
      this[symbols.raiseChangeEvents] = true;
      /** @type {any} */
      const cast = event;
      const date = cast.detail.date;
      this.setState({
        date
      });
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.input.addEventListener('date-changed', event => {
      this[symbols.raiseChangeEvents] = true;
      /** @type {any} */
      const cast = event;
      const date = cast.detail.date;
      this.setState({
        date
      });
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.todayButton.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
      this.date = calendar.today();
      this[symbols.raiseChangeEvents] = false;
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      date: null,
      inputRole: DateInput
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      date: null,
      focused: false,
      opened: false,
      value: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const { date, focused, opened, value } = state;
    if (changed.date || changed.focused || changed.opened) {
      // Update value from date if we've lost focus or were closed.
      const lostFocus = changed.focused && !focused;
      const closed = changed.opened && !opened;
      if (lostFocus || closed) {
        if (date !== null) {
          const dateTimeFormat = new Intl.DateTimeFormat(state.locale, {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          });
          const formattedDate = dateTimeFormat.format(date);
          if (state.value !== formattedDate) {
            state.value = formattedDate;
            result = false;
          }
        } else if (state.value !== '') {
          state.value = '';
          result = false;
        }
      }
    } else if (changed.value) {
      // Update date from value.
      // const parsedDate = new Date(value);
      // const time = parsedDate.getTime();
      // if (!isNaN(time) && time !== date.getTime()) {
      //   state.date = parsedDate;
      //   result = false;
      // }
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
          /* flex: 1; */
          width: 100%;
        }

        #todayButton {
          padding: 0.5em;
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
    const { date, locale } = this.state;
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

}


export default DateComboBox;
customElements.define('elix-date-combo-box', DateComboBox);
