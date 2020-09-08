import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Input styles in the Plain reference design system
 *
 * @module PlainInputMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainInputMixin(Base) {
  return class PlainInput extends Base {
    get [template]() {
      const result = super[template];
      result.content.append(fragmentFrom.html`
        <style>
          :host {
            background: white;
            border: 1px solid gray;
            box-sizing: border-box;
          }

          [part~=input] {
            background: transparent;
            border-color: transparent;
          }
        </style>
      `);
      return result;
    }
  };
}
