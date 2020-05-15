import DateInput from "../base/DateInput.js";
import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * DateInput component in the Plain reference design system
 *
 * @inherits DateInput
 */
class PlainDateInput extends DateInput {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
