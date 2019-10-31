import * as internal from '../../../src/internal.js';
import * as template from '../../../src/template.js';
import CrossfadeStage from '../../../src/CrossfadeStage.js';
import SereneTabButton from './SereneTabButton.js';
import Tabs from '../../../src/Tabs.js';

class SereneTabs extends Tabs {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      generic: false,
      itemRole: 'tabpanel',
      proxyPartType: SereneTabButton,
      stagePartType: CrossfadeStage
    });
  }

  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
      <style>
        :host {
          display: flex;
        }

        #proxyList {
          background: #222;
          color: white;
          font-family: Gentium Basic;
          padding: 0 33px;
        }

        #stage {
          background: white;
          padding: 0 33px;
        }
      </style>
    `
    );
  }
}

customElements.define('serene-tabs', SereneTabs);
export default SereneTabs;
