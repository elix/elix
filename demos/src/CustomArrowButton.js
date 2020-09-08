import Button from "../../src/base/Button.js";
import { template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";

class CustomArrowButton extends Button {
  get [template]() {
    const result = super[template];
    result.content.append(
      templateFrom.html`
        <style>
          :host {
            align-items: center;
            display: flex;
            font-size: 28px;
            font-weight: bold;
            margin: 0.5em;
            -webkit-tap-highlight-color: transparent;
          }
          
          [part~="button"] {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.7);
            border: 2px solid transparent;
            box-sizing: border-box;
            color: inherit;
            color: rgba(255, 255, 255, 0.7);
            fill: currentColor;
            flex: 1;
            font: inherit;
            height: 48px;
            margin: 0;
            outline: none;
            padding: 0;
            position: relative;
            transform: scale(1.0);
            transition: background 0.3s, border-color 0.3s, color 0.3s, transform 0.3s;
            width: 48px;
          }

          :host(:hover) [part~="button"]:not(:disabled) {
            border-color: rgba(255, 255, 255, 0.8);
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            transform: scale(1.1);
          }

          [part~="button"]:disabled {
            color: rgba(255, 255, 255, 0.2);
            transform: scale(1.0);
          }
        </style>
      `.content
    );
    return result;
  }
}

customElements.define("custom-arrow-button", CustomArrowButton);
export default CustomArrowButton;
