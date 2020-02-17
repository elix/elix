import * as internal from "../base/internal.js";
import html from "../core/html.js";
import TabStrip from "../base/TabStrip.js";

/**
 * @inherits TabStrip
 */
class PlainTabStrip extends TabStrip {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            grid-gap: 0.25em;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainTabStrip;
