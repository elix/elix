import { ownEvent } from "../core/dom.js";
import * as internal from "./internal.js";
import html from "../core/html.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupSource from "./PopupSource.js";

const Base = KeyboardMixin(PopupSource);

/**
 * A button that invokes an attached popup
 *
 * @inherits PopupSource
 * @mixes KeyboardMixin
 */
class PopupButton extends Base {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();

    // If the top-level element gets the focus while the popup is open, the most
    // likely expanation is that the user hit Shift+Tab to back up out of the
    // popup. In that case, we should close.
    this.addEventListener("focus", async event => {
      const hostFocused = !ownEvent(this[internal.ids].popup, event);
      // It's possible to get a focus event in the initial mousedown on the
      // source button before the popup is even rendered. We don't want to close
      // in that case, so we check to see if we've already measured the popup
      // dimensions (which will be true if the popup fully completed rendering).
      const measured = this[internal.state].popupHeight !== null;
      if (hostFocused && this.opened && measured) {
        this[internal.raiseChangeEvents] = true;
        await this.close();
        this[internal.raiseChangeEvents] = false;
      }
    });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      role: "button",
      sourcePartType: "button"
    });
  }

  [internal.keydown](/** @type {KeyboardEvent} */ event) {
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
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.sourcePartType) {
      // Desktop popups generally open on mousedown, not click/mouseup. On mobile,
      // mousedown won't fire until the user releases their finger, so it behaves
      // like a click.
      const source = this[internal.ids].source;
      source.addEventListener("mousedown", event => {
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
            this[internal.raiseChangeEvents] = true;
            this.open();
            this[internal.raiseChangeEvents] = false;
          }
        });
        event.stopPropagation();
        // We don't prevent the default behavior for mousedown. Among other
        // things, it sets the focus to the element the user moused down on.
        // That's important for us, because OverlayMixin will remember that
        // focused element (i.e., this element) when opening, and restore focus to
        // it when the popup closes.
      });
      source.tabIndex = -1;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
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
