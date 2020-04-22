import * as internal from "../../src/base/internal.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import * as template from "../../src/core/template.js";

class CustomOverlayFrame extends ReactiveElement {
  get [internal.template]() {
    return template.html`
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

customElements.define("custom-overlay-frame", CustomOverlayFrame);
export default CustomOverlayFrame;
