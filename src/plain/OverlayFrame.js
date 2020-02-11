import * as internal from "../core/internal.js";
import * as template from "../core/template.js";
import OverlayFrame from "../base/OverlayFrame.js";

/**
 * A simple frame for overlay content.
 *
 * The default appearance of `OverlayFrame` uses a simple drop-shadow to let the
 * user see the framed content as being on top of the background page content.
 *
 * @inherits ReactiveElement
 */
class PlainOverlayFrame extends OverlayFrame {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.2);
            box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainOverlayFrame;
