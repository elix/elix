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

  get date() {
    return super.date;
  }
  set date(date) {
    super.date = date;
    this.setState({
      datePriority: true
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
      date: null, // Don't pick a date by default
      dateTimeFormat: null,
      dateTimeFormatOptions,
      datePriority: false,
      focused: false
    });
  }

  formatDate(date, dateTimeFormat) {
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
      dateTimeFormat: null,
      dateTimeFormatOptions: null,
      focused: false,
      locale: null,
      value: null
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const {
      date,
      datePriority,
      dateTimeFormat,
      dateTimeFormatOptions,
      focused,
      locale,
      value
    } = state;
    const blur = changed.focused && !focused;
    if ((changed.date && !focused) || blur ||
        (changed.dateTimeFormat && datePriority)) {
      // Update value from date if the date was changed from the outside, we're
      // losing focus, or the format changed and the date was the last
      // substantive property set.
      const formattedDate = date ?
        this.formatDate(date, dateTimeFormat) :
        '';
      if (state.value !== formattedDate) {
        state.value = formattedDate;
        state.selectText = formattedDate.length > 0;
        result = false;
      }
    } else if (dateTimeFormat &&
      (changed.value || (changed.dateTimeFormat && !datePriority))) {
      // Update date from value if the value was changed, or the format changed
      // and the value was the last substantive property set.
      const parsedDate = this.parseDate(value, dateTimeFormat);
      if (parsedDate && !calendar.datesEqual(state.date, parsedDate)) {
        state.date = parsedDate;
        result = false;
      }
    }
    if (changed.locale || changed.dateTimeFormatOptions) {
      state.dateTimeFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
      result = false;
    }
    return result;
  }

  parseDate(text, dateTimeFormat) {
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
    this.setState({
      datePriority: false
    });
    this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
  }

}


export default DateInput;
customElements.define('elix-date-input', DateInput);
