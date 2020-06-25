import { template } from "../base/internal.js";
import Option from "../base/Option.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * An option in a list in the Plain reference design system
 *
 * @inherits Option
 */
class PlainChoice extends Option {
  get [template]() {
    const result = super[template];

    // Replace default slot with icon + slot.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <svg id="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="4 6 18 12">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        <slot></slot>
      `);
    }

    result.content.append(fragmentFrom.html`
      <style>
        :host {
          white-space: nowrap;
        }

        #checkmark {
          height: 1em;
          visibility: hidden;
          width: 1em;
        }

        :host([selected]) #checkmark {
          visibility: visible;
        }
      </style>

    `);

    return result;
  }
}

export default PlainChoice;
