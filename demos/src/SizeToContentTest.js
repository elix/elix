import { template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

class SizeToContentTest extends ReactiveElement {
  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-grid;
          grid-template: minmax(0, 1fr) / minmax(0, 1fr);
        }

        div {
          border: 2px dotted #888;
          box-sizing: border-box;
          display: grid;
          overflow: auto;
        }
      </style>
      <div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("size-to-content-test", SizeToContentTest);
export default SizeToContentTest;
