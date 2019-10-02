import * as internal from './internal.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';

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
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
          position: relative;
        }
      </style>
      <slot></slot>
    `;
  }
}

export default OverlayFrame;
