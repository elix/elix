import { defaultState, template } from "../base/internal.js";
import PullToRefresh from "../base/PullToRefresh.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { replace } from "../core/template.js";
import PlainProgressSpinner from "./PlainProgressSpinner.js";

// Template for the default down arrow shown while pulling.

/**
 * PullToRefresh component in the Plain reference design system
 *
 * @inherits PullToRefresh
 * @part {PlainProgressSpinner} refreshing-indicator
 */
class PlainPullToRefresh extends PullToRefresh {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      refreshingIndicatorPartType: PlainProgressSpinner,
      pullIndicatorPartType: "svg",
    });
  }

  get [template]() {
    const result = super[template];

    // Use a default down arrow icon as the pull indicator.
    const pullIndicator = result.content.querySelector(
      '[part~="pull-indicator"]'
    );
    const arrow = fragmentFrom.html`
      <svg
        viewBox="0 0 24 24"
        style="fill: #404040; height: 24px; width: 24px;"
      >
        <path
          d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
        />
      </svg>
    `.firstElementChild;
    if (pullIndicator && arrow) {
      replace(pullIndicator, arrow);
    }

    result.content.append(
      fragmentFrom.html`
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
