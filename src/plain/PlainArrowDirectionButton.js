import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import PlainButton from "./PlainButton.js";
import DarkModeMixin from "../base/DarkModeMixin.js";

const Base = DarkModeMixin(PlainButton);

/**
 * Left/right arrow button in the Plain reference design system
 *
 * This component is used by
 * [PlainArrowDirectionMixin](PlainArrowDirectionMixin) for its default
 * left/right arrow buttons.
 *
 * @inherits PlainButton
 * @mixes DarkModeMixin
 */
class PlainArrowDirectionButton extends Base {
  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    // Wait for knowledge of dark mode to be set after initial render.
    const { darkMode } = this[internal.state];
    if (changed.darkMode && darkMode !== null) {
      this[internal.ids].inner.classList.toggle("darkMode", darkMode);
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host {
            color: rgba(0, 0, 0, 0.7);
          }

          :host(:hover:not([disabled]))  {
            background: rgba(0, 0, 0, 0.2);
            color: rgba(0, 0, 0, 0.8);
            cursor: pointer;
          }

          :host([disabled]) {
            color: rgba(0, 0, 0, 0.3);
          }

          #inner {
            fill: currentcolor;
          }

          #inner.darkMode {
            color: rgba(255, 255, 255, 0.7);
          }

          #inner.darkMode:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.8);
          }

          #inner.darkMode:disabled {
            color: rgba(255, 255, 255, 0.3);
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainArrowDirectionButton;
