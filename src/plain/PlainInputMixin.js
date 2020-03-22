import * as internal from "../base/internal.js";
import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Input styles in the Plain reference design system
 *
 * @module PlainInputMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainInputMixin(Base) {
  return class PlainInput extends Base {
    get [internal.template]() {
      const result = super[internal.template];
      result.content.append(html`
        <style>
          :host {
            background: white;
            border: 1px solid gray;
            box-sizing: border-box;
          }

          [part~="inner"] {
            background: transparent;
            border-color: transparent;
          }
        </style>
      `);
      return result;
    }
  };
}
