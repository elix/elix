import * as internal from "../base/internal.js";
import html from "../core/html.js";
import PlainTabButton from "./PlainTabButton.js";
import PlainTabStrip from "./PlainTabStrip.js";
import Tabs from "../base/Tabs.js";

/**
 * @inherits Tabs
 * @part {PlainTabButton} proxy
 * @part {PlainTabStrip} proxy-list
 */
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
      html`
        <style>
          [part~="proxy-list"] {
            z-index: 1;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainTabs;
