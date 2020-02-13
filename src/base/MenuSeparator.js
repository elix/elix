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
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();
    this.setAttribute("aria-hidden", "true");
  }

  get disabled() {
    return true;
  }
}

export default MenuSeparator;
