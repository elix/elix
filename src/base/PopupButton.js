import { ownEvent } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import {
  defaultState,
  firstRender,
  ids,
  keydown,
  raiseChangeEvents,
  render,
  state,
  template,
} from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupDragSelectMixin from "./PopupDragSelectMixin.js";
import PopupSource from "./PopupSource.js";
import PopupToggleMixin from "./PopupToggleMixin.js";

const Base = DelegateFocusMixin(
  KeyboardMixin(PopupDragSelectMixin(PopupToggleMixin(PopupSource)))
);

/**
 * A button that invokes an attached popup
 *
 * @inherits PopupSource
 * @mixes DelegateFocusMixin
 * @mixes KeyboardMixin
 * @mixes PopupDragSelectMixin
 * @mixes PopupToggleMixin
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

      // Enter opens popup.
      case "Enter":
        if (!this.opened) {
          this.open();
          handled = true;
        }
        break;
    }

    // Give superclass a chance to handle.
    handled = super[keydown] && super[keydown](event);

    if (!handled && this.opened && !event.metaKey && !event.altKey) {
      // If they haven't already been handled, absorb keys that might cause the
      // page to scroll in the background, which would in turn cause the popup to
      // inadvertently close.
      switch (event.key) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "End":
        case "Home":
        case "PageDown":
        case "PageUp":
        case " ":
          handled = true;
      }
    }

    return handled;
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      // If the source element gets the focus while the popup is open, the
      // most likely expanation is that the user hit Shift+Tab to back up out of
      // the popup. In that case, we should close.
      this[ids].source.addEventListener("focus", async (event) => {
        const popupFocused = ownEvent(this[ids].popup, event);
        // It's possible to get a focus event in the initial mousedown on the
        // source button before the popup is even rendered. We don't want to
        // close in that case, so we check to see if we've already measured the
        // popup dimensions (which will be true if the popup fully completed
        // rendering).
        const measured = this[state].popupHeight !== null;
        if (!popupFocused && this.opened && measured) {
          this[raiseChangeEvents] = true;
          await this.close();
          this[raiseChangeEvents] = false;
        }
      });
    }

    if (changed.opened) {
      // Reflect opened state to attribute for styling.
      const { opened } = this[state];
      this.toggleAttribute("opened", opened);

      // Reflect opened state to source for ARIA.
      this[ids].source.setAttribute("aria-expanded", opened.toString());
    }

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

    if (changed.popupPartType) {
      this[ids].popup.removeAttribute("tabindex");
    }
  }

  get [template]() {
    const result = super[template];
    // When popup is open, it will have focus; don't show focus ring on host.
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

          :host([opened][focus-visible]) {
            outline: none;
          }
        </style>
      `
    );
    return result;
  }
}

export default PopupButton;
