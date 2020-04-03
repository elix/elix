import * as internal from "./internal.js";
import Hidden from "./Hidden.js";
import html from "../core/html.js";
import PopupButton from "./PopupButton.js";

/**
 * Button with a non-interactive tooltip that appears on hover
 */
class TooltipSource extends PopupButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      role: "none"
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    // Track when the mouse enters/leaves the source element.
    if (changed.sourcePartType) {
      const source = this[internal.ids].source;
      source.addEventListener("mouseenter", () => {
        this[internal.raiseChangeEvents] = true;
        this.open();
        this[internal.raiseChangeEvents] = false;
      });
      source.addEventListener("mouseleave", () => {
        this[internal.raiseChangeEvents] = true;
        this.close();
        this[internal.raiseChangeEvents] = false;
      });

      // HACK
      // source.addEventListener("keydown", event => {
      //   this[internal.raiseChangeEvents] = true;
      //   if (event.key === "Escape") {
      //     this.close({
      //       canceled: "Escape"
      //     });
      //   }
      //   this[internal.raiseChangeEvents] = false;
      // });
    }

    // Suppress popup's backdrop, which would interfere with tracking
    // mouseenter/mouseleave on the source element. Additionally, don't try to
    // focus on the popup when it opens.
    if (changed.popupPartType) {
      const popup = this[internal.ids].popup;
      if ("backdropPartType" in popup) {
        /** @type {any} */ (popup).backdropPartType = Hidden;
      }
      if ("autoFocus" in popup) {
        /** @type {any} */ (popup).autoFocus = Hidden;
      }

      // Even if the popup declares itself focusable, we want to keep focus on
      // the source.
      popup.tabIndex = -1;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // visually-hidden class from
    // https://inclusive-components.design/tooltips-toggletips/
    result.content.append(html`
      <style>
        #popup:not([opened]) {
          clip-path: inset(100%);
          clip: rect(1px, 1px, 1px, 1px);
          display: inherit;
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      </style>
    `);

    // Indicate that the button is described by the popup.
    const source = result.content.getElementById("source");
    if (source) {
      source.setAttribute("aria-describedby", "popup");
    }

    // Indicate that the popup is a tooltip.
    const popup = result.content.getElementById("popup");
    if (popup) {
      popup.setAttribute("role", "tooltip");
    }

    return result;
  }
}

export default TooltipSource;
