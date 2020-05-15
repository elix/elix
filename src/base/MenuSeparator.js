import ReactiveElement from "../core/ReactiveElement.js";
import { firstRender, render } from "./internal.js";

/**
 * Inactive item that helps group related menu items
 *
 * See [Menu](Menu) for sample usage.
 *
 * @inherits ReactiveElement
 */
class MenuSeparator extends ReactiveElement {
  get disabled() {
    return true;
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (this[firstRender]) {
      this.setAttribute("aria-hidden", "true");
    }
  }
}

export default MenuSeparator;
