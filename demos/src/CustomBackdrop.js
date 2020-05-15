import { template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

class CustomBackdrop extends ReactiveElement {
  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          background: white;
          height: 100%;
          left: 0;
          opacity: 0.5;
          position: fixed;
          top: 0;
          width: 100%;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define("custom-backdrop", CustomBackdrop);
export default CustomBackdrop;
