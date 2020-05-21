import { template } from "../base/internal.js";
import Menu from "../base/Menu.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

/**
 * Menu component in the Plain reference design system
 *
 * @inherits Menu
 */
class PlainMenu extends Menu {
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host ::slotted([current]) {
            background: highlight;
            color: highlighttext;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainMenu;
