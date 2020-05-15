import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * ListBox styles in the Plain reference design system
 *
 * @module PlainListBoxMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainListBoxMixin(Base) {
  return class PlainListBox extends Base {
    get [template]() {
      const result = super[template];
      result.content.append(
        fragmentFrom.html`
          <style>
            :host {
              border: 1px solid gray;
              box-sizing: border-box;
            }

            ::slotted(*),
            #slot > * {
              padding: 0.25em;
            }

            ::slotted([selected]),
            #slot > [selected] {
              background: highlight;
              color: highlighttext;
            }

            @media (pointer: coarse) {
              ::slotted(*),
              #slot > * {
                padding: 1em;
              }
            }
          </style>
        `
      );
      return result;
    }
  };
}
