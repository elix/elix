import './TabButton.js';
import './TabStrip.js';
import { ensureId } from './idGeneration.js';
import { merge } from './updates.js';
import Explorer from './Explorer.js';


/**
 * A set of pages with a tab strip governing which page is shown.
 *
 * Use tabs when you want to provide a large set of options or elements than
 * can comfortably fit inline, the options can be coherently grouped into pages,
 * and you want to avoid making the user navigate to a separate page. Tabs work
 * best if you only have a small handful of pages, say 2–7.
 *
 * @inherits Explorer
 * @elementtag {TabButton} proxy
 * @elementtag {TabStrip} proxyList
 */
class Tabs extends Explorer {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      itemRole: 'tabpanel',
      tabAlign: 'start'
    });
  }

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        proxy: 'elix-tab-button',
        proxyList: 'elix-tab-strip'
      })
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

  proxyUpdates(proxy, calcs) {
    const base = super.proxyUpdates(proxy, calcs);
    const item = calcs.item;
    const itemId = item ? ensureId(item) : '';
    const textContent = item ? (item.getAttribute('aria-label') || item.alt) : '';
    const defaultProxyUpdates = calcs.isDefaultProxy && {
      textContent
    };
    return merge(
      base,
      {
        attributes: {
          'aria-controls': itemId
        },
      },
      defaultProxyUpdates
    );
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

  get updates() {
    return merge(super.updates, {
      $: {
        proxyList: {
          attributes: {
            'tab-align': this.state.tabAlign
          },
          style: {
            'z-index': 1
          }
        }
      }
    });
  }

}


customElements.define('elix-tabs', Tabs);
export default Tabs;
