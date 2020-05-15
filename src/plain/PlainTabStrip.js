import { template } from "../base/internal.js";
import TabStrip from "../base/TabStrip.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * Toast component in the Plain reference design system
 *
 * @inherits TabStrip
 */
class PlainTabStrip extends TabStrip {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
