import { deepContains, ownEvent } from "../core/dom.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/** @type {any} */
const implicitCloseListenerKey = Symbol("implicitCloseListener");

/**
 * Gives an overlay lightweight popup-style behavior.
 *
 * This mixin expects the component to provide:
 *
 * * An open/close API compatible with `OpenCloseMixin`.
 *
 * The mixin provides these features to the component:
 *
 * * Event handlers that close the element presses the Esc key, moves the focus
 *   outside the element, scrolls the document, resizes the document, or
 *   switches focus away from the document.
 * * A default ARIA role of `alert`.
 *
 * For modal overlays, use `DialogModalityMixin` instead. See the documentation
 * of that mixin for a comparison of modality behaviors.
 *
 * @module PopupModalityMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PopupModalityMixin(Base) {
  // The class prototype added by the mixin.
  class PopupModality extends Base {
    constructor() {
      // @ts-ignore
      super();

      // If we lose focus, and the new focus isn't inside us, then close.
      this.addEventListener("blur", blurHandler.bind(this));
    }

    [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
      }
      if (changed.opened) {
        if (this.opened) {
          // Wait before wiring up events – if the popup was opened because the
          // user clicked something, that opening click event may still be
          // bubbling up, and we only want to start listening after it's been
          // processed. Alternatively, if the popup caused the page to scroll, we
          // don't want to immediately close because the page scrolled (only if
          // the user scrolls).
          const callback =
            "requestIdleCallback" in window
              ? window["requestIdleCallback"]
              : setTimeout;
          callback(() => {
            // It's conceivable the popup was closed before the timeout completed,
            // so double-check that it's still opened before listening to events.
            if (this.opened) {
              addEventListeners(this);
            }
          });
        } else {
          removeEventListeners(this);
        }
      }
    }

    /**
     * True if the popup should close if the user resizes the window.
     *
     * @type {boolean}
     * @default true
     */
    get closeOnWindowResize() {
      return this[internal.state].closeOnWindowResize;
    }
    set closeOnWindowResize(closeOnWindowResize) {
      this[internal.setState]({ closeOnWindowResize });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        closeOnWindowResize: true,
        role: "alert"
      });
    }

    // Close on Esc key.
    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;

      switch (event.key) {
        case "Escape":
          this.close({
            canceled: "Escape"
          });
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super.keydown && super.keydown(event)) || false;
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
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
  }

  return PopupModality;
}

function addEventListeners(/** @type {ReactiveElement} */ element) {
  // Close handlers for window events.
  element[implicitCloseListenerKey] = closeHandler.bind(element);

  // Window blur event tracks loss of focus of *window*, not just element.
  window.addEventListener("blur", element[implicitCloseListenerKey]);
  window.addEventListener("resize", element[implicitCloseListenerKey]);
  window.addEventListener("scroll", element[implicitCloseListenerKey]);
}

function removeEventListeners(/** @type {ReactiveElement} */ element) {
  if (element[implicitCloseListenerKey]) {
    window.removeEventListener("blur", element[implicitCloseListenerKey]);
    window.removeEventListener("resize", element[implicitCloseListenerKey]);
    window.removeEventListener("scroll", element[implicitCloseListenerKey]);
    element[implicitCloseListenerKey] = null;
  }
}

async function blurHandler(/** @type {Event} */ event) {
  // @ts-ignore
  /** @type {any} */ const element = this;
  // What has the focus now?
  const newFocusedElement =
    /** @type {any} */ (event).relatedTarget || document.activeElement;
  /** @type {any} */
  if (
    newFocusedElement instanceof Element &&
    !deepContains(element, newFocusedElement)
  ) {
    element[internal.raiseChangeEvents] = true;
    await element.close();
    element[internal.raiseChangeEvents] = false;
  }
}

async function closeHandler(/** @type {Event} */ event) {
  // @ts-ignore
  /** @type {any} */ const element = this;
  const handleEvent =
    event.type !== "resize" || element[internal.state].closeOnWindowResize;
  if (!ownEvent(element, event) && handleEvent) {
    element[internal.raiseChangeEvents] = true;
    await element.close();
    element[internal.raiseChangeEvents] = false;
  }
}
