// import CustomRepeatButton from "./CustomRepeatButton.js";
import * as internal from "../core/internal.js";
import html from "../core/html.js";
import NumberSpinBox from "../base/NumberSpinBox.js";
import PlainButton from "./PlainButton.js";
import PlainInput from "./PlainInput.js";

export default class PlainNumberSpinBox extends NumberSpinBox {
  get [internal.defaultState]() {
    return {
      ...super[internal.defaultState],
      buttonPartType: PlainButton,
      inputPartType: PlainInput
    };
  }

  get [internal.template]() {
    const result = super[internal.template];
    const upButton = result.content.getElementById("upButton");
    upButton.textContent = "▲";
    const downButton = result.content.getElementById("downButton");
    downButton.textContent = "▼";
    result.content.append(html`
      <style>
        :host {
          border: 1px solid gray;
        }

        [part~="input"] {
          border: none;
          width: 4em;
        }

        [part~="spin-button"] {
          border: 1px solid gray;
          box-sizing: border-box;
          font-size: 0.6em;
          padding: 2px;
        }

        [part~="up-button"] {
          border-right: none;
          border-top: none;
        }

        [part~="down-button"] {
          border-bottom: none;
          border-right: none;
          border-top: none;
        }
      </style>
    `);
    return result;
  }
}

customElements.define("plain-number-spin-box", PlainNumberSpinBox);
