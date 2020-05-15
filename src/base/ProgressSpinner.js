import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import {
  defaultState,
  rendered,
  setState,
  state,
  template,
} from "./internal.js";

/**
 * Spinning progress indicator
 *
 * This component is used by [PullToRefresh](PullToRefresh) as the default
 * indicator that a refresh operation is in progress.
 *
 * @inherits ReactiveElement
 */
class ProgressSpinner extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      count: -1,
      playing: true,
      rotationsPerSecond: 10,
    });
  }

  /**
   * True if the progress spinner is currently spinning.
   *
   * @type {boolean}
   * @default true
   */
  get playing() {
    return this[state].playing;
  }
  set playing(playing) {
    this[setState]({ playing });
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);
    if (changed.count || (changed.playing && this[state].playing)) {
      tick(this);
    }
  }

  get [template]() {
    return templateFrom.html`
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
  const delay = 1000 / element[state].rotationsPerSecond;
  if (element.isConnected && element[state].playing) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        element[setState]({
          count: element[state].count + 1,
        });
      });
    }, delay);
  }
}

export default ProgressSpinner;
