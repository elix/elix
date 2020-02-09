import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

// Symbols for private data members.
/** @type {any} */
const previousBodyOverflowKey = Symbol("previousBodyStyleOverflow");
/** @type {any} */
const previousDocumentMarginRightKey = Symbol("previousDocumentMarginRight");

/**
 * Gives an overlay modal behavior.
 *
 * This blocks various user interactions to make an overlay behave like a modal
 * dialog:
 *
 * * Disables scrolling on the background document. **This is a global
 *   side-effect of opening the component.**
 * * A default ARIA role of `dialog`.
 * * Closes the element if user presses the Esc key.
 *
 * For modeless overlays, see `PopupModalityMixin` instead.
 *
 * @module DialogModalityMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DialogModalityMixin(Base) {
  return class DialogModality extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        role: "dialog"
      });
    }

    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;

      switch (event.key) {
        case "Escape":
          // Close on Esc key.
          this.close({
            canceled: "Escape"
          });
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        handled ||
        (super[internal.keydown] && super[internal.keydown](event)) ||
        false
      );
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.opened) {
        if (this[internal.state].opened && document.documentElement) {
          // Disable body scrolling to absorb space bar keypresses and other
          // means of scrolling the top-level document.
          const documentWidth = document.documentElement.clientWidth;
          const scrollBarWidth = window.innerWidth - documentWidth;
          this[previousBodyOverflowKey] = document.body.style.overflow;
          this[previousDocumentMarginRightKey] =
            scrollBarWidth > 0
              ? document.documentElement.style.marginRight
              : null;
          document.body.style.overflow = "hidden";
          if (scrollBarWidth > 0) {
            document.documentElement.style.marginRight = `${scrollBarWidth}px`;
          }
        } else {
          // Reenable body scrolling.
          if (this[previousBodyOverflowKey] != null) {
            document.body.style.overflow = this[previousBodyOverflowKey];
            this[previousBodyOverflowKey] = null;
          }
          if (this[previousDocumentMarginRightKey] != null) {
            document.documentElement.style.marginRight = this[
              previousDocumentMarginRightKey
            ];
            this[previousDocumentMarginRightKey] = null;
          }
        }
      }
      if (changed.role) {
        // Apply top-level role.
        const { role } = this[internal.state];
        this.setAttribute("role", role);
      }
    }

    // Setting the standard role attribute will invoke this property setter,
    // which will allow us to update our state.
    get role() {
      return super.role;
    }
    set role(role) {
      super.role = role;
      if (!this[internal.rendering]) {
        this[internal.setState]({ role });
      }
    }
  };
}
