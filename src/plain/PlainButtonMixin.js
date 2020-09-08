import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Button styles in the Plain reference design system
 *
 * @module PlainButtonMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainButtonMixin(Base) {
  return class PlainButton extends Base {
    get [template]() {
      const result = super[template];
      result.content.append(fragmentFrom.html`
        <style>
          :host([disabled]) ::slotted(*) {
            opacity: 0.5;
          }

          [part~=inner] {
            display: inline-flex;
            justify-content: center;
            margin: 0;
            position: relative;
          }
        </style>
      `);
      return result;
    }
  };
}
