import ReactiveElement from "../core/ReactiveElement.js";
import * as template from "../core/template.js";
import * as internal from "./internal.js";

/**
 * A simple frame for overlay content.
 *
 * The default appearance of `OverlayFrame` uses a simple drop-shadow to let the
 * user see the framed content as being on top of the background page content.
 *
 * @inherits ReactiveElement
 */
class OverlayFrame extends ReactiveElement {
  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
      </style>
      <slot></slot>
    `;
  }
}

export default OverlayFrame;
