import CheckListItem from "../base/CheckListItem.js";
import { template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * CheckListItem component in the Plain reference design system
 */
class PlainCheckListItem extends CheckListItem {
  get [template]() {
    const result = super[template];
    result.content.append(fragmentFrom.html`
      <style>
        :host {
          grid-gap: 0.25em;
        }
      </style>
    `);
    return result;
  }
}

export default PlainCheckListItem;
