import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * A simple frame for an overlay that displays a drop-shadow.
 * 
 * @inherits ReactiveElement
 */
class OverlayFrame extends ReactiveElement {

  get [symbols.template]() {
    return `
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


customElements.define('elix-overlay-frame', OverlayFrame);
export default OverlayFrame;
