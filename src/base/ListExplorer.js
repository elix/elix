import * as internal from "./internal.js";
import Explorer from "./Explorer.js";

/**
 * Master/detail user interface pattern navigated with a list box.
 *
 * @inherits Explorer
 */
class ListExplorer extends Explorer {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyListPosition: "start",
      orientation: "vertical"
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    const { items, proxiesAssigned } = this[internal.state];
    /** @type {Element[]} */ const proxies = this[internal.state].proxies;
    if ((changed.proxies || changed.items) && proxies && !proxiesAssigned) {
      // Update default proxy text from item labels.
      proxies.forEach((proxy, index) => {
        const item = items[index];
        if (item) {
          const label =
            item.getAttribute("aria-label") || "alt" in item
              ? /** @type {any} */ (item).alt
              : "";
          proxy.textContent = label;
        }
      });
    }
  }
}

export default ListExplorer;
