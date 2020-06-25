import { template } from "../base/internal.js";
import OptionList from "../base/OptionList.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * OptionList component in the Plain reference design system
 *
 * @inherits OptionList
 */
class PlainOptionList extends OptionList {
  get [template]() {
    const result = super[template];

    result.content.append(fragmentFrom.html`
      <style>
        ::slotted(*),
        #slot > * {
          padding: 0.25em;
        }

        ::slotted([current]),
        #slot > [current] {
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
    `);

    return result;
  }
}

export default PlainOptionList;
