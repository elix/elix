import { merge } from './updates.js'
import Explorer from './Explorer.js';


/**
 * Master/detail user interface pattern navigated with a list box.
 * 
 * @inherits Explorer
 */
class ListExplorer extends Explorer {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      proxyListPosition: 'start',
      orientation: 'vertical'
    });
  }

  proxyUpdates(proxy, calcs) {
    const base = super.proxyUpdates(proxy, calcs);
    const item = calcs.item;
    const label = item.getAttribute('aria-label') || item.alt;
    return merge(base, {
      textContent: label
    });
  }

}


customElements.define('elix-list-explorer', ListExplorer);
export default ListExplorer;
