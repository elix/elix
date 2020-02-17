import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import PlainTabButton from "./PlainTabButton.js";
import PlainTabStrip from "./PlainTabStrip.js";
import Tabs from "../base/Tabs.js";

class PlainTabs extends Tabs {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      itemRole: "tabpanel",
      proxyPartType: PlainTabButton,
      proxyListPartType: PlainTabStrip,
      tabAlign: "start"
    });
  }
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #proxyList {
            z-index: 1;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainTabs;
