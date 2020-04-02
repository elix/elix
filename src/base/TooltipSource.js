import * as internal from "./internal.js";
import Hidden from "./Hidden.js";
import PopupSource from "./PopupSource.js";

/**
 * Source for a non-interactive tooltip that appears on hover
 */
class TooltipSource extends PopupSource {
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
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Indicate that the source is described by the popup.
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
