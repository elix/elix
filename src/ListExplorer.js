import './ListBox.js';
import { merge } from './updates.js'
import Explorer from './Explorer.js';


class ListExplorer extends Explorer {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listPosition: 'left',
      orientation: 'vertical'
    });
  }

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        list: 'elix-list-box'
      })
    });
  }

  proxyUpdates(proxy, item, index) {
    const base = super.proxyUpdates(proxy, item, index);
    const label = item.getAttribute('aria-label') || item.alt;
    return merge(base, {
      textContent: label
    });
  }

}


customElements.define('elix-list-explorer', ListExplorer);
export default ListExplorer;
