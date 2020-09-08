import { defaultState, template } from "../base/internal.js";
import Tabs from "../base/Tabs.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainTabButton from "./PlainTabButton.js";
import PlainTabStrip from "./PlainTabStrip.js";

/**
 * Tabs component in the Plain reference design system
 *
 * @inherits Tabs
 * @part {PlainTabButton} proxy
 * @part {PlainTabStrip} proxy-list
 */
class PlainTabs extends Tabs {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      itemRole: "tabpanel",
      proxyPartType: PlainTabButton,
      proxyListPartType: PlainTabStrip,
      tabAlign: "start",
    });
  }
  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
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
