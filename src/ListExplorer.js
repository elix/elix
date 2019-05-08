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

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    const usingDefaultProxies = state.defaultProxies.length > 0;
    const proxies = usingDefaultProxies ?
      state.defaultProxies :
      state.assignedProxies;
    if ((changed.assignedProxies || changed.defaultProxies || changed.items)
        && proxies) {
      // Update default proxy text from item labels.
      const { items } = state;
      proxies.forEach((proxy, index) => {
        const item = items[index];
        if (item && usingDefaultProxies) {
          const label = item.getAttribute('aria-label') || item.alt;
          proxy.textContent = label;
        }
      });
    }
  }

}


customElements.define('elix-list-explorer', ListExplorer);
export default ListExplorer;
