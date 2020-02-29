import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ReactiveElement from "../core/ReactiveElement.js";

/**
 * An element that can point up or down.
 *
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 */
class UpDownToggle extends ReactiveElement {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      direction: "down",
      disabled: false
    });
  }

  /**
   * Indicates which direction the element should point to.
   *
   * @type {'down'|'up'}
   * @default 'down'
   */
  get direction() {
    return this[internal.state].direction;
  }
  set direction(direction) {
    this[internal.setState]({ direction });
  }

  get disabled() {
    return this[internal.state].disabled;
  }
  set disabled(disabled) {
    this[internal.setState]({ disabled });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.direction) {
      const { direction } = this[internal.state];
      this[internal.ids].downIcon.style.display =
        direction === "down" ? "block" : "none";
      this[internal.ids].upIcon.style.display =
        direction === "up" ? "block" : "none";
    }

    if (changed.disabled) {
      const { disabled } = this[internal.state];
      this.toggleAttribute("disabled", disabled);
    }
  }

  get [internal.template]() {
    return template.html`
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
