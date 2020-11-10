import { getDefaultText } from "./content.js";
import Explorer from "./Explorer.js";
import { defaultState, getItemText, render, state } from "./internal.js";

/**
 * Master/detail user interface pattern navigated with a list box.
 *
 * @inherits Explorer
 */
class ListExplorer extends Explorer {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      proxyListPosition: "start",
      orientation: "vertical",
    });
  }

  /**
   * Extract the text from the given item.
   *
   * The default implementation returns an item's `aria-label`, `alt` attribute,
   * `innerText`, or `textContent`, in that order. You can override this to
   * return the text that should be used.
   *
   * @param {Element} item
   * @returns {string}
   */
  [getItemText](item) {
    return super[getItemText] ? super[getItemText](item) : getDefaultText(item);
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    const { items, proxiesAssigned } = this[state];
    /** @type {Element[]} */ const proxies = this[state].proxies;
    if ((changed.proxies || changed.items) && proxies && !proxiesAssigned) {
      // Update default proxy text from item labels.
      proxies.forEach((proxy, index) => {
        const item = items[index];
        if (item) {
          const text = this[getItemText](item);
          proxy.textContent = text;
        }
      });
    }
  }
}

export default ListExplorer;
