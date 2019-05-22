import * as symbols from './symbols.js';
import Explorer from './Explorer.js';


/**
 * Master/detail user interface pattern navigated with a list box.
 * 
 * @inherits Explorer
 */
class ListExplorer extends Explorer {

  get defaultState() {
    return Object.assign(super.defaultState, {
      proxyListPosition: 'start',
      orientation: 'vertical'
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    const { items, proxies, proxiesAssigned } = this.state;
    if ((changed.proxies || changed.items) && proxies && !proxiesAssigned) {
      // Update default proxy text from item labels.
      proxies.forEach((proxy, index) => {
        const item = items[index];
        if (item) {
          const label = item.getAttribute('aria-label') ||
            'alt' in item ? /** @type {any} */ (item).alt : '';
          proxy.textContent = label;
        }
      });
    }
  }

}


customElements.define('elix-list-explorer', ListExplorer);
export default ListExplorer;
