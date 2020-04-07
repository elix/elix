import * as internal from "../base/internal.js";
import html from "../core/html.js";
import PlainInput from "./PlainInput.js";
import PlainRepeatButton from "./PlainRepeatButton.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * SpinBox design in the Plain reference design system
 *
 * @module PlainSpinBoxMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {PlainRepeatButton} button
 * @part {PlainInput} input
 */
export default function PlainSpinBoxMixin(Base) {
  return class PlainSpinBox extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        buttonPartType: PlainRepeatButton,
        inputPartType: PlainInput
      });
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
            background: white;
            border: 1px solid gray;
            box-sizing: border-box;
          }

          [part~="input"] {
            background: transparent;
            border: none;
            width: 4em;
          }

          [part~="spin-button"] {
            background: transparent;
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
  };
}
