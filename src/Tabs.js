import './TabButton.js';
import './TabStrip.js';
import { merge } from './updates.js';
import Explorer from './Explorer.js';


class Tabs extends Explorer {

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

  itemUpdates(item, index) {
    
  }

  proxyUpdates(proxy, item, index) {
    const base = super.proxyUpdates(proxy, item, index);
    const areaControls = item.id;
    const textContent = item.getAttribute('aria-label') || item.alt;
    // const itemId = getIdForSubelement(this, item, index, 'panel');
    // const proxyId = getIdForSubelement(this, proxy, index, 'button');
    // if (!proxy.id) {
    //   proxy.setAttribute('id', proxyId);
    // }
    // proxy.setAttribute('aria-controls', panelId);
    return merge(base, {
      attributes: {
        'aria-controls': areaControls
      },
      textContent
    });
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


function getIdForSubelement(element, subelement, descriptor, index) {
  let id = subelement.id;
  if (!id) {
    const hostId = element.id ?
      `_${element.id}{descriptor.toUpperCase()}` :
      `_${descriptor}`;
    id = `${hostId}${index}`;
  }
  return id;
}


function getIdForPanel(element, panel, index) {
  let id = panel.id;
  if (!id) {
    const hostId = element.id ?
      "_" + element.id + "Panel" :
      "_panel";
    id = `${hostId}${index}`;
  }
  return id;
}


customElements.define('elix-tabs', Tabs);
export default Tabs;
