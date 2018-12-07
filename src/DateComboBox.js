import './CalendarMonthNavigator.js'
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ComboBox from './ComboBox.js';


const Base =
  CalendarElementMixin(
    ComboBox
  );

  
class DateComboBox extends Base {

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    this.$.calendar.addEventListener('date-changed', event => {
      /** @type {any} */
      const cast = event;
      const date = cast.detail.date;
      this.setState({
        date
      });
    });
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
        calendar: {
          date,
          locale
        },
        input: {
          value: date.toDateString()
        }
      }
    });
  }

}


export default DateComboBox;
customElements.define('elix-date-combo-box', DateComboBox);
