import * as internal from "../base/internal.js";
import DrawerWithGrip from "../base/DrawerWithGrip.js";
import html from "../core/html.js";
import PlainDrawerMixin from "./PlainDrawerMixin.js";
import PlainModalOverlayMixin from "./PlainModalOverlayMixin.js";

/**
 * DrawerWithGrip component in the Plain reference design system
 *
 * @inherits DrawerWithGrip
 * @mixes PlainModalOverlayMixin
 */
class PlainDrawerWithGrip extends PlainDrawerMixin(
  PlainModalOverlayMixin(DrawerWithGrip)
) {
  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    // Rotate the default grip icon to reflect the swipe axis.
    if (changed.swipeAxis && this[internal.ids].gripIcon) {
      const transform =
        this[internal.state].swipeAxis === "horizontal" ? "rotate(90deg)" : "";
      this[internal.ids].gripIcon.style.transform = transform;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Fill the grip slot with our icon.
    // Default grip icon from Material Design icons "drag handle".
    const gripSlot = result.content.querySelector('slot[name="grip"]');
    if (gripSlot) {
      gripSlot.append(
        html`
          <svg
            id="gripIcon"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <defs>
              <path id="a" d="M0 0h24v24H0V0z" />
            </defs>
            <clipPath id="b">
              <use xlink:href="#a" overflow="visible" />
            </clipPath>
            <path clip-path="url(#b)" d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />
          </svg>
        `
      );
    }

    return result;
  }
}

export default PlainDrawerWithGrip;
