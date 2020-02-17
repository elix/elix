import * as internal from "../base/internal.js";
import html from "../core/html.js";
import OverlayFrame from "../base/OverlayFrame.js";

/**
 * OverlayFrame component in the Plain reference design system
 *
 * The default appearance of `OverlayFrame` uses a simple drop-shadow to let the
 * user see the framed content as being on top of the background page content.
 *
 * @inherits OverlayFrame
 */
class PlainOverlayFrame extends OverlayFrame {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.2);
            box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainOverlayFrame;
