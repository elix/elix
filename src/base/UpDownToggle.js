import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import DisabledMixin from "./DisabledMixin.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "./internal.js";

const Base = DisabledMixin(ReactiveElement);

/**
 * An element that can point up or down.
 *
 * @inherits ReactiveElement
 * @mixes DisabledMixin
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part toggle-icon - both the up and down icons
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 */
class UpDownToggle extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      direction: "down",
    });
  }

  /**
   * Indicates which direction the element should point to.
   *
   * @type {'down'|'up'}
   * @default 'down'
   */
  get direction() {
    return this[state].direction;
  }
  set direction(direction) {
    this[setState]({ direction });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (changed.direction) {
      const { direction } = this[state];
      this[ids].downIcon.style.display =
        direction === "down" ? "block" : "none";
      this[ids].upIcon.style.display = direction === "up" ? "block" : "none";
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <div id="downIcon" part="toggle-icon down-icon">
        <slot name="down-icon"></slot>
      </div>
      <div id="upIcon" part="toggle-icon up-icon">
        <slot name="up-icon"></slot>
      </div>
    `;
  }
}

export default UpDownToggle;
