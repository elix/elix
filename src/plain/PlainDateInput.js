import * as internal from "../base/internal.js";
import DateInput from "../base/DateInput.js";
import html from "../core/html.js";

/**
 * DateInput component in the Plain reference design system
 *
 * @inherits DateInput
 */
class PlainDateInput extends DateInput {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            width: 6em;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainDateInput;
