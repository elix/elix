import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "./internal.js";

/**
 * An element that can point up or down.
 *
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 */
class UpDownToggle extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      direction: "down",
      disabled: false,
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

  get disabled() {
    return this[state].disabled;
  }
  set disabled(disabled) {
    this[setState]({ disabled });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (changed.direction) {
      const { direction } = this[state];
      this[ids].downIcon.style.display =
        direction === "down" ? "block" : "none";
      this[ids].upIcon.style.display = direction === "up" ? "block" : "none";
    }

    if (changed.disabled) {
      const { disabled } = this[state];
      this.toggleAttribute("disabled", disabled);
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <div id="downIcon" part="down-icon">
        <slot name="down-icon"></slot>
      </div>
      <div id="upIcon" part="up-icon">
        <slot name="up-icon"></slot>
      </div>
    `;
  }
}

export default UpDownToggle;
