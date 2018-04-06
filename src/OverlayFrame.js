import * as symbols from './symbols.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  FocusCaptureMixin(
    ReactiveElement
  );


/**
 * A simple frame for an overlay that displays a drop-shadow.
 * 
 * @inherits ReactiveElement
 * @mixes FocusCaptureMixin
 */
class OverlayFrame extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          padding: 1em;
          position: relative;
        }
      </style>
      ${this[FocusCaptureMixin.inject](`
        <slot></slot>
      `)}
    `;
  }

}


customElements.define('elix-overlay-frame', OverlayFrame);
export default OverlayFrame;
