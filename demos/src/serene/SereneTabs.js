import CrossfadeStage from "../../../src/base/CrossfadeStage.js";
import { defaultState, template } from "../../../src/base/internal.js";
import Tabs from "../../../src/base/Tabs.js";
import { templateFrom } from "../../../src/core/htmlLiterals.js";
import SereneTabButton from "./SereneTabButton.js";

class SereneTabs extends Tabs {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      generic: false,
      itemRole: "tabpanel",
      proxyPartType: SereneTabButton,
      stagePartType: CrossfadeStage,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      templateFrom.html`
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
