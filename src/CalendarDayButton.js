import * as calendar from './calendar.js';
import * as internal from './internal.js';
import * as template from './template.js';
import CalendarDay from './CalendarDay.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  CalendarElementMixin(
    SeamlessButton
  );


class CalendarDayButton extends Base {

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      date: calendar.today(),
      outsideRange: false,
      selected: false,
      tabIndex: -1
    });
  }

  get outsideRange() {
    return this[internal.state].outsideRange;
  }
  set outsideRange(outsideRange) {
    this[internal.setState]({
      outsideRange
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    /** @type {any} */ const day = this[internal.ids].day;
    if (changed.date) {
      day.date = this[internal.state].date;
    }
    if (changed.locale) {
      day.locale = this[internal.state].locale;
    }
    if (changed.outsideRange) {
      day.outsideRange = this[internal.state].outsideRange;
    }
    if (changed.selected) {
      day.selected = this[internal.state].selected;
    }
  }

  get selected() {
    return this[internal.state].selected;
  }
  set selected(selected) {
    this[internal.setState]({
      selected
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    // Replace default slot with calendar day.
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      const dayTemplate = document.createElement('template');
      const day = new CalendarDay();
      day.id = "day";
      dayTemplate.content.append(day);
      template.transmute(defaultSlot, dayTemplate);
    }
    // Style outer button.
    const styleTemplate = template.html`
      <style>
        :host {
          border: 1px solid transparent;
        }

        :host(:hover) {
          border-color: gray;
        }

        #day {
          width: 100%;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);
    return result;
  }

}


export default CalendarDayButton;
