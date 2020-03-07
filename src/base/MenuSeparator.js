import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js";

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

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (this[internal.firstRender]) {
      this.setAttribute("aria-hidden", "true");
    }
  }
}

export default MenuSeparator;
