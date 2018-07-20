import { merge } from '../../../src/updates.js';
import CrossfadeStage from '../../../src/CrossfadeStage.js';
import SereneTabButton from './SereneTabButton.js';
import Tabs from '../../../src/Tabs.js';


class SereneTabs extends Tabs {

  constructor() {
    super();
    Object.assign(this.elementDescriptors, {
      proxy: SereneTabButton,
      stage: CrossfadeStage
    })
  }


  get updates() {
    return merge(super.updates, {
      style: {
        display: 'flex'
      },
      $: {
        proxyList: {
          style: {
            'background': '#222',
            'color': 'white',
            'font-family': 'Gentium Basic',
            'padding': '0 33px'
          }
        },
        stage: {
          style: {
            'background': 'white',
            'padding': '0 33px'
          }
        }
      }
    });
  }

}


customElements.define('serene-tabs', SereneTabs);
export default SereneTabs;
