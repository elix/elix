import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import DateInput from "../base/DateInput.js";

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
