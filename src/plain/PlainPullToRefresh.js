import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import html from "../core/html.js";
import PlainProgressSpinner from "./PlainProgressSpinner.js";
import PullToRefresh from "../base/PullToRefresh.js";

// Template for the default down arrow shown while pulling.
const downArrowTemplate = template.html`
  <svg viewBox="0 0 24 24" style="fill: #404040; height: 24px; width: 24px;">
    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
  </svg>
`;

/**
 * PullToRefresh component in the Plain reference design system
 *
 * @inherits PullToRefresh
 * @part {PlainProgressSpinner} refreshing-indicator
 */
class PlainPullToRefresh extends PullToRefresh {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      pullIndicatorPartType: downArrowTemplate,
      refreshingIndicatorPartType: PlainProgressSpinner
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          [part~="indicator-container"] {
            padding: 1em;
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainPullToRefresh;
