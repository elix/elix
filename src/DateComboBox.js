import './CalendarMonthNavigator.js'
import './SeamlessButton.js';
import { forwardFocus } from './utilities.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as calendar from './calendar.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ComboBox from './ComboBox.js';


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

    const state = Object.assign(super.defaultState, {
      datePriority: false,
      dateSelected: false,
      dateTimeFormat: null,
      dateTimeFormatOptions,
      timeBias: null
    });

    // If the date changed while focused, assume user changed date.
    state.onChange(['date', 'value'], state => {
      if (state.focused) {
        return {
          userChangedDate: true
        };
      }
      return null;
    })

    // Update value from date if:
    // the date was changed from the outside,
    // we're closing or losing focus and the user's changed the date,
    // or the format changed and the date was the last substantive property set.
    state.onChange(['date', 'dateTimeFormat', 'focused', 'opened'], (state, changed) => {
      const {
        closeResult,
        date,
        datePriority,
        dateTimeFormat,
        focused,
        opened,
        userChangedDate
      } = state;
      const closing = changed.opened && !opened;
      const canceled = closeResult && closeResult.canceled;
      const blur = changed.focused && !focused;
      if ((changed.date && !focused) ||
          (blur && userChangedDate) ||
          (closing && userChangedDate && !canceled) ||
          (changed.dateTimeFormat && datePriority)) {
        const formattedDate = date ?
          this.formatDate(date, dateTimeFormat) :
          '';
        // if (state.value !== formattedDate) {
        //   state.selectText = formattedDate.length > 0;
        return {
          selectText: formattedDate.length > 0,
          value: formattedDate
        };
      }
      return null;
    });

    // Update date from value if the value was changed, or the date format or
    // time bias changed and the value was the last substantive property set.
    state.onChange(['dateTimeFormat', 'timeBias', 'value'], (state, changed) => {
      const {
        datePriority,
        dateTimeFormat,
        timeBias,
        value
      } = state;
      if (dateTimeFormat &&
          (changed.value ||
          (!datePriority && (changed.dateTimeFormat || changed.timeBias)))) {
        const parsedDate = this.parseDate(value, dateTimeFormat, timeBias);
        if (parsedDate) {
          return {
            date: parsedDate
          };
        }
      }
      return null;
    });

    // Update our date format if the locale or format options change.
    state.onChange(['dateTimeFormatOptions', 'locale'], state => {
      const { dateTimeFormatOptions, locale } = state;
      const dateTimeFormat = calendar.dateTimeFormat(locale, dateTimeFormatOptions);
      return {
        dateTimeFormat
      };
    });

    return state;
  }

  formatDate(date, dateTimeFormat) {
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

    const opened = this.opened;
    const date = this.state.date || calendar.today();

    switch (event.key) {

      case 'ArrowDown':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goDown]();
        }
        break;

      case 'ArrowLeft':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goLeft]();
        }
        break;

      case 'ArrowRight':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goRight]();
        }
        break;

      case 'ArrowUp':
        if (opened && event.ctrlKey && event.shiftKey) {
          handled = this[symbols.goUp]();
        }
        break;

      case 'PageDown':
        if (opened) {
          this.setState({
            date: calendar.offsetDateByMonths(date, 1)
          });
          handled = true;
        }
        break;
        
      case 'PageUp':
        if (opened) {
          this.setState({
            date: calendar.offsetDateByMonths(date, -1)
          });
          handled = true;
        }
        break;

    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
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

  parseDate(text, dateTimeFormat, timeBias) {
    return calendar.parseWithOptionalYear(text, dateTimeFormat, timeBias);
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, DateComboBox, symbols.template);

    // Replace default slot with calendar.
    const calendarTemplate = template.html`
      <style>
        :host {
          width: 8em;
        }

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

  /**
   * If set, this indicates whether a date containing only a month and day
   * should infer a year such that the time is in the future or in the past.
   * 
   * Example: the current date is July 1, the locale is "en-US", and the
   * supplied value is "9/1" (September 1 in the U.S.), then if `timeBias` is
   * not set, the inferred year is the present year. If `timeBias` is set to
   * "past", the date is taken to be a past date, so the inferred year will be
   * the _previous_ year.
   * 
   * @type {'future'|'past'|null}
   */
  get timeBias() {
    return this.state.timeBias;
  }
  set timeBias(timeBias) {
    this.setState({
      timeBias
    });
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


export default DateComboBox;
customElements.define('elix-date-combo-box', DateComboBox);
