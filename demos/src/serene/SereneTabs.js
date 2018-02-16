import './SereneModes.js';
import './SereneTabButton.js';
import { merge } from '../../../src/updates.js';
import Tabs from '../../../src/Tabs.js';


class SereneTabs extends Tabs {

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        tabButton: 'serene-tab-button',
        tabPanels: 'serene-modes'
      })
    });
  }

  get updates() {
    return merge(super.updates, {
      style: {
        display: 'flex'
      },
      $: {
        tabStrip: {
          style: {
            'background': '#222',
            'color': 'white',
            'font-family': 'Gentium Basic',
            'padding': '0 33px'
          }
        }
      }
    });
  }

}


customElements.define('serene-tabs', SereneTabs);
export default SereneTabs;
