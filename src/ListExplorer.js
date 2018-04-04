import './ListBox.js';
import { merge } from './updates.js'
import Explorer from './Explorer.js';


/**
 * A master/detail user interface pattern that presents a list of choices with a
 * [ListBox](ListBox).
 * 
 * @inherits Explorer
 * @elementtag {ListBox} list
 */
class ListExplorer extends Explorer {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listPosition: 'start',
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
