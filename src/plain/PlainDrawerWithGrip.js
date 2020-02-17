import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import DrawerWithGrip from "../base/DrawerWithGrip.js";
import PlainModalBackdrop from "./PlainModalBackdrop.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";

class PlainDrawerWithGrip extends DrawerWithGrip {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: PlainModalBackdrop,
      framePartType: PlainOverlayFrame
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    if (changed.swipeAxis && this[internal.ids].gripIcon) {
      // Rotate the default grip icon to reflect the swipe axis.
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
        template.html`
          <svg id="gripIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
            <defs>
              <path id="a" d="M0 0h24v24H0V0z"/>
            </defs>
            <clipPath id="b">
              <use xlink:href="#a" overflow="visible"/>
            </clipPath>
            <path clip-path="url(#b)" d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"/>
          </svg>
        `.content
      );
    }

    result.content.append(
      template.html`
        <style>

        </style>
      `.content
    );
    return result;
  }
}

export default PlainDrawerWithGrip;
