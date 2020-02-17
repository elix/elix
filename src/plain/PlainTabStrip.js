import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import TabStrip from "../base/TabStrip.js";

/**
 * @inherits TabStrip
 */
class PlainTabStrip extends TabStrip {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            grid-gap: 0.25em;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainTabStrip;
