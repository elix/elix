import { getSuperProperty } from './workarounds.js';
import { stateChanged } from './utilities.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import Input from './Input.js';


const previousStateKey = Symbol('previousState');


const Base =
  CalendarElementMixin(
    Input
  );


class DateInput extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.inner.addEventListener('blur', () => {
      this[symbols.raiseChangeEvents] = true;
      this.setState({
        focused: false
      });
      this[symbols.raiseChangeEvents] = false;
    });
    this.$.inner.addEventListener('focus', () => {
      this[symbols.raiseChangeEvents] = true;
      this.setState({
        focused: true
      });
      this[symbols.raiseChangeEvents] = false;
    });
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
      focused: false
    });
  }

  formatDate(date, options) {
    const { locale, dateTimeFormatOptions } = options;
    const dateTimeFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
    return dateTimeFormat.format(date);
  }

  get locale() {
    return super.locale;
  }
  set locale(locale) {
    // If external code sets the locale, it's impossible for that code to predict
    // the effects on the value, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[symbols.raiseChangeEvents];
    this[symbols.raiseChangeEvents] = true;
    super.locale = locale;
    this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      date: null,
      focused: false,
      locale: null,
      value: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const { date, dateTimeFormatOptions, focused, locale, value } = state;
    if (changed.date || changed.focused || changed.locale) {
      // Update value from date if we're not focused.
      if (!focused) {
        if (date !== null) {
          const formattedDate = this.formatDate(date, {
            dateTimeFormatOptions,
            locale
          });
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
      const parsedDate = this.parseDate(value, {
        dateTimeFormatOptions,
        locale
      });
      if (!calendar.datesEqual(state.date, parsedDate)) {
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
    const result = getSuperProperty(this, DateInput, symbols.template);
    const styleTemplate = template.html`
      <style>
        #inner {
          width: 8em;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
  }

  get value() {
    return super.value;
  }
  set value(value) {
    // If external code sets the value, it's impossible for that code to predict
    // the effects on the date, so we'll need to raise change events.
    const saveRaiseChangesEvents = this[symbols.raiseChangeEvents];
    this[symbols.raiseChangeEvents] = true;
    super.value = value;
    this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
  }

}


export default DateInput;
customElements.define('elix-date-input', DateInput);
