import * as symbols from '../../src/symbols.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import { html } from '../../src/templates.js';


class CustomOverlayFrame extends ReactiveElement {

  get [symbols.template]() {
    return html`
      <style>
        :host {
          background: rgb(255, 240, 240);
          border: 5px solid rgba(255, 0, 0, 0.2);
          border-radius: 10px;
          padding: 2em;
          position: relative;
        }
      </style>
      <slot></slot>
    `;
  }

}


customElements.define('custom-overlay-frame', CustomOverlayFrame);
export default CustomOverlayFrame;
