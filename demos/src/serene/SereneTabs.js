import * as internal from "../../../src/base/internal.js";
import * as template from "../../../src/core/template.js";
import CrossfadeStage from "../../../src/base/CrossfadeStage.js";
import SereneTabButton from "./SereneTabButton.js";
import Tabs from "../../../src/base/Tabs.js";

class SereneTabs extends Tabs {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      generic: false,
      itemRole: "tabpanel",
      proxyPartType: SereneTabButton,
      stagePartType: CrossfadeStage,
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            display: flex;
          }

          [part~="proxy-list"] {
            background: #222;
            color: white;
            font-family: Gentium Basic;
            padding: 0 33px;
          }

          [part~="stage"] {
            background: white;
            padding: 0 33px;
          }
        </style>
      `.content
    );
    return result;
  }
}

customElements.define("serene-tabs", SereneTabs);
export default SereneTabs;
