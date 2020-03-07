import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js";

/**
 * An element with no visible appearance
 *
 * In some situations, you may be using a component that defines an
 * [element role](customizing#element-part-types) that you don't want to fill.
 * In such cases, you can indicate that the `Hidden` element class should be
 * used to fill that role. The component will create an instance of this class
 * inside its shadow tree, but the element will be invisible to the user.
 *
 * @inherits ReactiveElement
 */
class Hidden extends ReactiveElement {
  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (this[internal.firstRender]) {
      this.setAttribute("hidden", "");
    }
  }
}

export default Hidden;
