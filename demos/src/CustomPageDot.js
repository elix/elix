import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

class CustomPageDot extends ReactiveElement {
  get [internal.template]() {
    return template.html`
      <style>
        :host {
          background: rgb(255, 255, 255);
          box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
          cursor: pointer;
          height: 12px;
          margin: 7px 5px;
          padding: 0;
          transition: border-color 0.3s, color 0.3s, transform 0.3s !important;
          width: 12px;
        }

        :host(:hover) {
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transform: scale(1.3);
        }
      </style>
    `;
  }
}

customElements.define("custom-page-dot", CustomPageDot);
export default CustomPageDot;
