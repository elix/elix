import * as internal from "../base/internal.js";
import DarkModeMixin from "../base/DarkModeMixin.js";
import html from "../core/html.js";
import SelectableButton from "../base/SelectableButton.js";

const Base = DarkModeMixin(SelectableButton);

/**
 * A small dot component in the Plain reference design system
 *
 * This used as the default proxy element to represent items in carousels like
 * [PlainCarousel](PlainCarousel).
 *
 * @inherits SelectableButton
 * @mixes DarkModeMixin
 */
class PlainPageDot extends Base {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();
    this.setAttribute("role", "none");
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    const { darkMode } = this[internal.state];
    // Wait for knowledge of dark mode
    if (changed.darkMode && darkMode !== null) {
      this.style.backgroundColor = darkMode
        ? "rgb(255, 255, 255)"
        : "rgb(0, 0, 0)";
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          :host {
            border-radius: 7px;
            box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
            box-sizing: border-box;
            cursor: pointer;
            height: 8px;
            margin: 7px 5px;
            padding: 0;
            transition: opacity 0.2s;
            width: 8px;
          }

          @media (min-width: 768px) {
            :host {
              height: 12px;
              width: 12px;
            }
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainPageDot;
