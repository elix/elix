import CenteredStrip from "../base/CenteredStrip.js";
import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * Centered strip showing selected item with a highlight color
 *
 * [`CenteredStripHighlight` uses a system highlight, much like `ListBox`](/demos/centeredStripHighlight.html)
 *
 * For a variation that uses opacity instead of a highlight color, see
 * [CenteredStripOpacity](CenteredStripOpacity).
 *
 * @inherits CenteredStrip
 */
class PlainCenteredStripHighlight extends CenteredStrip {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          ::slotted(*) {
            padding: 0.25em;
          }

          ::slotted([selected]) {
            background: highlight;
            color: highlighttext;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainCenteredStripHighlight;
