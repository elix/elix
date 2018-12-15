import './CalendarDay.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Button from './Button.js';
import CalendarElementMixin from './CalendarElementMixin.js';


const Base =
  CalendarElementMixin(
    Button
  );


class CalendarDayButton extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selected: false
    });
  }

  get selected() {
    return this.state.selected;
  }
  set selected(selected) {
    this.setState({
      selected
    });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, CalendarDayButton, symbols.template);
    // Replace default slot with calendar day.
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      const dayTemplate = template.html`
        <elix-calendar-day id="day"></elix-calendar-day>
      `;
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

  get updates() {
    const { date, locale, selected } = this.state;
    return merge(super.updates, {
      attributes: {
        tabindex: '-1'
      },
      $: {
        day: {
          date,
          locale,
          selected
        }
      }
    });
  }

}


export default CalendarDayButton;
customElements.define('elix-calendar-day-button', CalendarDayButton);
