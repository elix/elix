import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import DateInput from "../base/DateInput.js";

/**
 * DateInput component in the Plain reference design system
 *
 * @inherits DateInput
 */
class PlainDateInput extends DateInput {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            width: 6em;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainDateInput;
