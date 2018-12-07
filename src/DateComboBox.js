import './CalendarMonthNavigator.js'
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import { stateChanged } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ComboBox from './ComboBox.js';
import { calendar } from './elix.js';


const previousStateKey = Symbol('previousState');


const Base =
  CalendarElementMixin(
    ComboBox
  );

  
class DateComboBox extends Base {

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    this.$.todayButton.addEventListener('mousedown', event => {
      this.date = calendar.today();
    });
    this.$.calendar.addEventListener('date-changed', event => {
      /** @type {any} */
      const cast = event;
      const date = cast.detail.date;
      this.setState({
        date
      });
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      date: null,
      value: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const { date, value } = state;
    if (changed.date) {
      // Update value from date.
      const formattedDate = date.toDateString();
      if (state.value !== formattedDate) {
        state.value = date.toDateString();
        result = false;
      }
    } else if (changed.value) {
      // Update date from value.
      const parsedDate = new Date(value);
      const time = parsedDate.getTime();
      if (!isNaN(time) && time !== date.getTime()) {
        state.date = parsedDate;
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
          /* flex: 1; */
          width: 100%;
        }
      </style>
      <elix-calendar-month-navigator id="calendar"></elix-calendar-month-navigator>
      <button id="todayButton">Today</button>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, calendarTemplate);
    }

    return result;
  }

  get updates() {
    const { date, locale, value } = this.state;
    return merge(super.updates, {
      $: {
        calendar: {
          date,
          locale
        },
        input: {
          value
        }
      }
    });
  }

}


export default DateComboBox;
customElements.define('elix-date-combo-box', DateComboBox);
