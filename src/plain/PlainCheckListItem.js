import CheckListItem from "../base/CheckListItem.js";
import * as internal from "../base/internal.js";
import html from "../core/html.js";

/**
 * CheckListItem component in the Plain reference design system
 */
class PlainCheckListItem extends CheckListItem {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(html`
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
