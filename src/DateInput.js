import { getSuperProperty } from './workarounds.js';
import { stateChanged } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import Input from './Input.js';
import { calendar } from './elix.js';


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
          const dateTimeFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
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
      const parsedDate = parseDate(value, locale, dateTimeFormatOptions);
      if (!calendar.datesEqual(state.date, parsedDate)) {
        state.date = parsedDate;
        result = false;
      }
    }
    return result;
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


function parseDate(text, locale, dateTimeFormatOptions) {
  const fullFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
  // Try parsing using requested options.
  const fullDate = calendar.parse(text, fullFormat);
  if (fullDate) {
    return fullDate;
  }
  // Try parsing without year. Create an identical DateTimeFormat options, but
  // mark `year` as undefined so it won't be used.
  const abbreviatedOptions = Object.assign(
    {},
    dateTimeFormatOptions,
    {
      year: undefined
    }
  );
  const abbreviatedFormat = calendar.dateTimeFormat(locale, abbreviatedOptions);
  const abbreviatedDate = calendar.parse(text, abbreviatedFormat);
  return abbreviatedDate;
}


export default DateInput;
customElements.define('elix-date-input', DateInput);
