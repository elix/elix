import * as internal from "../../../src/base/internal.js";
import TabButton from "../../../src/base/TabButton.js";
import * as template from "../../../src/core/template.js";

class SereneTabButton extends TabButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      generic: false,
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            margin-left: 0;
          }

          [part~="inner"] {
            background: #222;
            border: none;
            color: inherit;
            display: inline-block;
            font-size: 18px;
            margin: 0;
            padding: 0.5em 1em;
            touch-action: manipulation;
            transition: background 0.6s ease-out;
            -webkit-tap-highlight-color: transparent;
            white-space: nowrap;
          }

          :host(:hover) [part~="inner"] {
            background: #444;
          }

          :host([selected]) [part~="inner"] {
            background: #666;
          }
        </style>
      `.content
    );
    return result;
  }
}

customElements.define("serene-tab-button", SereneTabButton);
export default SereneTabButton;
