import { fragmentFrom } from "../core/htmlLiterals.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import {
  defaultState,
  ids,
  keydown,
  raiseChangeEvents,
  render,
  template,
} from "./internal.js";
import ToggledPopupSource from "./ToggledPopupSource.js";

const Base = DelegateFocusMixin(ToggledPopupSource);

/**
 * A button that invokes an attached popup
 *
 * @inherits ToggledPopupSource
 * @mixes DelegateFocusMixin
 */
class PopupButton extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      sourcePartType: "button",
    });
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled;

    switch (event.key) {
      // Space or Up/Down arrow keys open the popup.
      case " ":
      case "ArrowDown":
      case "ArrowUp":
        if (this.closed) {
          this.open();
          handled = true;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    // if (this[firstRender]) {
    //   // If the source element gets the focus while the popup is open, the
    //   // most likely expanation is that the user hit Shift+Tab to back up out of
    //   // the popup. In that case, we should close.
    //   this.addEventListener("focus", async (event) => {
    //     const hostFocused = !ownEvent(this[ids].popup, event);
    //     // It's possible to get a focus event in the initial mousedown on the
    //     // source button before the popup is even rendered. We don't want to
    //     // close in that case, so we check to see if we've already measured the
    //     // popup dimensions (which will be true if the popup fully completed
    //     // rendering).
    //     const measured = this[state].popupHeight !== null;
    //     if (hostFocused && this.opened && measured) {
    //       this[raiseChangeEvents] = true;
    //       await this.close();
    //       this[raiseChangeEvents] = false;
    //     }
    //   });
    // }

    if (changed.sourcePartType) {
      // Desktop popups generally open on mousedown, not click/mouseup. On mobile,
      // mousedown won't fire until the user releases their finger, so it behaves
      // like a click.
      const source = this[ids].source;
      source.addEventListener("mousedown", (event) => {
        // mousedown events fire even if button is disabled, so we need
        // to explicitly ignore those.
        if (this.disabled) {
          event.preventDefault();
          return;
        }
        // Only handle primary button mouse down to avoid interfering with
        // right-click behavior.
        /** @type {any} */
        const cast = event;
        if (cast.button && cast.button !== 0) {
          return;
        }
        // We give the default focus behavior time to run before opening the
        // popup. See note below.
        setTimeout(() => {
          if (!this.opened) {
            this[raiseChangeEvents] = true;
            this.open();
            this[raiseChangeEvents] = false;
          }
        });
        event.stopPropagation();
        // We don't prevent the default behavior for mousedown. Among other
        // things, it sets the focus to the element the user moused down on.
        // That's important for us, because OverlayMixin will remember that
        // focused element (i.e., this element) when opening, and restore focus to
        // it when the popup closes.
      });
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          [part~="source"] {
            cursor: default;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-user-select: none;
            user-select: none;
          }
        </style>
      `
    );
    return result;
  }
}

export default PopupButton;
