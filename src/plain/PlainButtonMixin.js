import * as internal from "../base/internal.js";
import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Button styles in the Plain reference design system
 *
 * @module PlainButtonMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainButtonMixin(Base) {
  return class PlainButton extends Base {
    get [internal.template]() {
      const result = super[internal.template];
      result.content.append(html`
        <style>
          :host([disabled]) {
            color: gray;
          }

          [part~="inner"] {
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
