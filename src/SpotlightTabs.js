import './TabButton.js';
import './TabStrip.js';
import { merge } from './updates.js';
import Explorer from './Explorer.js';


class SpotlightTabs extends Explorer {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      tabAlign: 'start'
    });
  }

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        list: 'elix-tab-strip',
        proxy: 'elix-tab-button'
      })
    });
  }

  setProxyItem(proxy, item) {
    super.setProxyItem(proxy, item);
    const label = item.getAttribute('aria-label') || item.alt;
    // const panelId = getIdForPanel(element, panel, index);
    // const id = getIdForTabButton(element, index);
    // avatar.setAttribute('id', id);
    // avatar.setAttribute('aria-controls', panelId);
    proxy.textContent = label;
  }

  /**
   * The alignment of the tabs within the tab strip.
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
        list: {
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


customElements.define('elix-spotlight-tabs', SpotlightTabs);
export default SpotlightTabs;
