import * as internal from "./internal.js";
import * as template from "../core/template.js";
import SelectableButton from "./SelectableButton.js";

/**
 * A button that can point up or down.
 *
 * @part down-icon - the icon shown in the toggle button if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle button if the popup will open or close in the up direction
 */
class UpDownButton extends SelectableButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      direction: "down"
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

  [internal.render](changed) {
    super[internal.render](changed);
    if (changed.direction) {
      const { direction } = this[internal.state];
      this[internal.ids].downIcon.style.display =
        direction === "down" ? "block" : "none";
      this[internal.ids].upIcon.style.display =
        direction === "up" ? "block" : "none";
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Replace the default slot with our up/down icons.
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.replace(
        defaultSlot,
        template.html`
          <div id="downIcon" part="down-icon">
            <slot name="down-icon"></slot>
          </div>
          <div id="upIcon" part="up-icon">
            <slot name="up-icon"></slot>
          </div>
      `.content
      );
    }

    return result;
  }
}

export default UpDownButton;
