import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ReactiveElement from "../core/ReactiveElement.js";

/**
 * Spinning progress indicator
 *
 * This component is used by [PullToRefresh](PullToRefresh) as the default
 * indicator that a refresh operation is in progress.
 *
 * @inherits ReactiveElement
 */
class ProgressSpinner extends ReactiveElement {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();
    tick(this);
  }

  [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
    super[internal.componentDidUpdate](changed);
    if (changed.count || (changed.playing && this[internal.state].playing)) {
      tick(this);
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      count: -1,
      playing: true,
      rotationsPerSecond: 10
    });
  }

  /**
   * True if the progress spinner is currently spinning.
   *
   * @type {boolean}
   * @default true
   */
  get playing() {
    return this[internal.state].playing;
  }
  set playing(playing) {
    this[internal.setState]({ playing });
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <slot></slot>
    `;
  }
}

function tick(/** @type {ProgressSpinner} */ element) {
  // Complete a full rotation in a second (1000 milliseconds).
  const delay = 1000 / element[internal.state].rotationsPerSecond;
  if (element.isConnected && element[internal.state].playing) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        element[internal.setState]({
          count: element[internal.state].count + 1
        });
      });
    }, delay);
  }
}

export default ProgressSpinner;
