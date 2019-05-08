import { ensureId } from './idGeneration.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import Explorer from './Explorer.js';
import TabButton from './TabButton.js';
import TabStrip from './TabStrip.js';


/**
 * Basic tabs structure for navigation and configuration
 *
 * Use tabs when you want to provide a large set of options or elements than
 * can comfortably fit inline, the options can be coherently grouped into pages,
 * and you want to avoid making the user navigate to a separate page. Tabs work
 * best if you only have a small handful of pages, say 2–7.
 *
 * @inherits Explorer
 * @elementrole {TabButton} proxy
 * @elementrole {TabStrip} proxyList
 */
class Tabs extends Explorer {

  get defaultState() {
    return Object.assign(super.defaultState, {
      itemRole: 'tabpanel',
      proxyRole: TabButton,
      proxyListRole: TabStrip,
      tabAlign: 'start'
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};

    // Ensure each item has an ID.
    const baseId = base.attributes && base.attributes.id;
    const id = baseId || ensureId(item);
    const role = original.role || base.role || this.state.itemRole;

    // Get ID for corresponding proxy.
    const proxies = this.proxies;
    const proxy = proxies && proxies[calcs.index];
    const proxyId = proxy ?
      ensureId(proxy) :
      null;

    return merge(base, {
      attributes: {
        'aria-labelledby': proxyId,
        id,
        role
      }
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
      // Also indicate which item is controlled by each proxy.
      const { items } = state;
      proxies.forEach((proxy, index) => {
        const item = items[index];
        if (item) {
          if (usingDefaultProxies) {
            const label = item.getAttribute('aria-label') || item.alt;
            proxy.textContent = label;
          }
          const id = item ? ensureId(item) : '';
          proxy.setAttribute('aria-controls', id);
        }
      });
    }
    if (changed.tabAlign) {
      // Apply alignment to proxy list.
      if ('tabAlign' in this.$.proxyList) {
        const proxyList = /** @type {any} */ (this.$.proxyList);
        proxyList.tabAlign = state.tabAlign;
      }
    }
  }

  /**
   * The alignment of the tabs within the tab strip.
   * 
   * The value of this property will be forwarded to the corresponding
   * property
   * 
   * @type {('start'|'center'|'end'|'stretch')}
   * @default 'start'
   */
  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        #proxyList {
          z-index: 1;
        }
      </style>
    `);
  }

}


customElements.define('elix-tabs', Tabs);
export default Tabs;
