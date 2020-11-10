import { defaultState, template } from "../../../src/base/internal.js";
import TabButton from "../../../src/base/TabButton.js";
import { templateFrom } from "../../../src/core/htmlLiterals.js";

class SereneTabButton extends TabButton {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      generic: false,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      templateFrom.html`
        <style>
          :host {
            margin-left: 0;
          }

          [part~="button"] {
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

          :host(:hover) [part~="button"] {
            background: #444;
          }

          :host([selected]) [part~="button"] {
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
