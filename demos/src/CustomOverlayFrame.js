import { template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

class CustomOverlayFrame extends ReactiveElement {
  get [template]() {
    return templateFrom.html`
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
