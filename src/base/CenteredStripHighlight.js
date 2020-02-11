import * as internal from "./internal.js";
import * as template from "../core/template.js";
import CenteredStrip from "./CenteredStrip.js";

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
class CenteredStripHighlight extends CenteredStrip {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          ::slotted(*) {
            padding: 0.25em;
          }

          ::slotted([selected]) {
            background: highlight;
            color: highlighttext;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default CenteredStripHighlight;
