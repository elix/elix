import * as symbols from '../../src/symbols.js';
import FocusCaptureMixin from '../../src/FocusCaptureMixin.js';
import ReactiveElement from '../../src/ReactiveElement.js';


const Base =
  FocusCaptureMixin(
    ReactiveElement
  );


class CustomOverlayFrame extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
          background: rgb(255, 240, 240);
          border: 5px solid rgba(255, 0, 0, 0.2);
          border-radius: 10px;
          padding: 2em;
          position: relative;
        }
      </style>
      ${this[FocusCaptureMixin.inject](`
        <slot></slot>
      `)}
    `;
  }

}


customElements.define('custom-overlay-frame', CustomOverlayFrame);
export default CustomOverlayFrame;
