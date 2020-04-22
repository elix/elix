import Explorer from "./Explorer.js";
import * as internal from "./internal.js";

/**
 * Master/detail user interface pattern navigated with a list box.
 *
 * @inherits Explorer
 */
class ListExplorer extends Explorer {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyListPosition: "start",
      orientation: "vertical",
    });
  }

  /**
   * Extract the text from the given item.
   *
   * The default implementation returns an item's `aria-label`, `alt` attribute,
   * or its `textContent`, in that order. You can override this to return the
   * text that should be used.
   *
   * @param {ListItemElement} item
   * @returns {string}
   */
  [internal.getItemText](item) {
    return getItemText(item);
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    const { items, proxiesAssigned } = this[internal.state];
    /** @type {Element[]} */ const proxies = this[internal.state].proxies;
    if ((changed.proxies || changed.items) && proxies && !proxiesAssigned) {
      // Update default proxy text from item labels.
      proxies.forEach((proxy, index) => {
        const item = items[index];
        if (item) {
          const text = this[internal.getItemText](item);
          proxy.textContent = text;
        }
      });
    }
  }
}

/**
 * Extract the text from the given item.
 *
 * @private
 * @param {ListItemElement} item
 */
export function getItemText(item) {
  return (
    item.getAttribute("aria-label") ||
    item.getAttribute("alt") ||
    item.textContent ||
    ""
  );
}

export default ListExplorer;
