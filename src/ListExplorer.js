import './ListBox.js';
import { merge } from './updates.js';
import AriaListMixin from './AriaListMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import KeyboardPagedSelectionMixin from './KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from './KeyboardPrefixSelectionMixin.js';
import Explorer from './Explorer.js';
import * as symbols from './symbols.js';


const Base =
  AriaListMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
    Explorer
  ))))));


class ListExplorer extends Base {

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

  pageDown() {
    /** @type {any} */
    const list = this.$.list;
    const result = list.pageDown();
    // Sync selectedIndex in case its changed.
    this.setState({
      selectedIndex: list.selectedIndex
    });
    return result;
  }

  pageUp() {
    /** @type {any} */
    const list = this.$.list;
    const result = list.pageUp();
    // Sync selectedIndex in case its changed.
    this.setState({
      selectedIndex: list.selectedIndex
    });
    return result;
  }

  get [symbols.scrollTarget]() {
    return this.$.list[symbols.scrollTarget];
  }

  setProxyItem(proxy, item) {
    super.setProxyItem(proxy, item);
    const label = item.getAttribute('aria-label') || item.alt;
    proxy.textContent = label;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        list: {
          attributes: {
            role: 'none',
            tabindex: ''
          }
        }
      }
    });
  }

}


customElements.define('elix-list-explorer', ListExplorer);
export default ListExplorer;
