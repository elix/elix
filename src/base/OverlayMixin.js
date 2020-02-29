import { deepContains, firstFocusableElement } from "../core/dom.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/** @type {any} */
const appendedToDocumentKey = Symbol("appendedToDocument");
/** @type {any} */
const defaultZIndexKey = Symbol("assignedZIndex");
/** @type {any} */
const restoreFocusToElementKey = Symbol("restoreFocusToElement");

/**
 * Displays an opened element on top of other page elements.
 *
 * This mixin handles showing and hiding an overlay element. It, together with
 * [OpenCloseMixin](OpenCloseMixin), form the core behavior for [Overlay](Overlay),
 * which in turn forms the basis of Elix's overlay components.
 *
 * @module OverlayMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function OverlayMixin(Base) {
  // The class prototype added by the mixin.
  class Overlay extends Base {
    constructor() {
      // @ts-ignore
      super();
      this.addEventListener("blur", event => {
        // What has the focus now?
        const newFocusedElement = event.relatedTarget || document.activeElement;
        /** @type {any} */
        const node = this;
        if (newFocusedElement instanceof HTMLElement) {
          const focusInside = deepContains(node, newFocusedElement);
          if (!focusInside) {
            if (this.opened) {
              // The user has most likely clicked on something in the background
              // of a modeless overlay. Remember that element, and restore focus
              // to it when the overlay finishes closing.
              this[restoreFocusToElementKey] = newFocusedElement;
            } else {
              // A blur event fired, but the overlay closed itself before the blur
              // event could be processed. In closing, we may have already
              // restored the focus to the element that originally invoked the
              // overlay. Since the user has clicked somewhere else to close the
              // overlay, put the focus where they wanted it.
              newFocusedElement.focus();
              this[restoreFocusToElementKey] = null;
            }
          }
        }
      });
    }

    // TODO: Document
    get autoFocus() {
      return this[internal.state].autoFocus;
    }
    set autoFocus(autoFocus) {
      this[internal.setState]({ autoFocus });
    }

    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }
      openedChanged(this);

      // Perform one-time check to see if component needs a default z-index.
      if (this[internal.state].persistent && !hasZIndex(this)) {
        bringToFront(this);
      }
    }

    [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
      }
      if (changed.opened) {
        openedChanged(this);
      }

      // If we're finished closing an overlay that was automatically added to the
      // document, remove it now. Note: we only do this when the component
      // updates, not when it mounts, because we don't want an automatically-added
      // element to be immediately removed during its connectedCallback.
      if (
        !this[internal.state].persistent &&
        this.closeFinished &&
        this[appendedToDocumentKey]
      ) {
        this[appendedToDocumentKey] = false;
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
      }
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        autoFocus: true,
        persistent: false
      });
    }

    async open() {
      if (!this[internal.state].persistent && !this.isConnected) {
        // Overlay isn't in document yet.
        this[appendedToDocumentKey] = true;
        document.body.appendChild(this);
      }
      if (super.open) {
        await super.open();
      }
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.effectPhase || changed.opened || changed.persistent) {
        if (!this[internal.state].persistent) {
          // Temporary overlay
          const closed =
            typeof this.closeFinished === "undefined"
              ? this.closed
              : this.closeFinished;

          // We'd like to just use the `hidden` attribute, but Edge has trouble
          // with that: if the hidden attribute is removed from an overlay to
          // display it, Edge may not paint it correctly. And a side-effect
          // of styling with the hidden attribute is that naive styling of the
          // component from the outside (to change to display: flex, say) will
          // override the display: none implied by hidden. To work around both
          // these problems, we use display: none when the overlay is closed.
          this.style.display = closed ? "none" : "";

          if (closed) {
            if (this[defaultZIndexKey]) {
              // Remove default z-index.
              this.style.zIndex = "";
              this[defaultZIndexKey] = null;
            }
          } else if (this[defaultZIndexKey]) {
            this.style.zIndex = this[defaultZIndexKey];
          } else {
            if (!hasZIndex(this)) {
              bringToFront(this);
            }
          }
        }
      }
    }
  }

  return Overlay;
}

// Pick a default z-index, remember it, and apply it.
function bringToFront(element) {
  const defaultZIndex = maxZIndexInUse() + 1;
  element[defaultZIndexKey] = defaultZIndex;
  element.style.zIndex = defaultZIndex.toString();
}

/**
 * If the element has or inherits an explicit numeric z-index, return true.
 * Otherwise, return false.
 *
 * @private
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function hasZIndex(element) {
  const computedZIndex = getComputedStyle(element).zIndex;
  const explicitZIndex = element.style.zIndex;
  const isExplicitZIndexNumeric = !isNaN(parseInt(explicitZIndex));
  if (computedZIndex === "auto") {
    return isExplicitZIndexNumeric;
  }
  if (computedZIndex === "0" && !isExplicitZIndexNumeric) {
    // Might be on Safari, which reports a computed z-index of zero even in
    // cases where no z-index has been inherited but the element creates a
    // stacking context. Inspect the composed tree parent to infer whether the
    // element is really inheriting a z-index.
    const parent =
      element.assignedSlot ||
      (element instanceof ShadowRoot ? element.host : element.parentNode);
    if (!(parent instanceof HTMLElement)) {
      // Theoretical edge case, assume zero z-index is real.
      return true;
    }
    if (!hasZIndex(parent)) {
      // The parent doesn't have a numeric z-index, and the element itself
      // doesn't have a numeric z-index, so the "0" value for the computed
      // z-index is simulated, not a real assigned numeric z-index.
      return false;
    }
  }
  // Element has a non-zero numeric z-index.
  return true;
}

/*
 * Return the highest z-index currently in use in the document's light DOM.
 *
 * This calculation looks at all light DOM elements, so is theoretically
 * expensive. That said, it only runs when an overlay is opening, and is only used
 * if an overlay doesn't have a z-index already. In cases where performance is
 * an issue, this calculation can be completely circumvented by manually
 * applying a z-index to an overlay.
 */
function maxZIndexInUse() {
  const elements = document.body.querySelectorAll("*");
  const zIndices = Array.from(elements, element => {
    const style = getComputedStyle(element);
    let zIndex = 0;
    if (style.position !== "static" && style.zIndex !== "auto") {
      const parsed = style.zIndex ? parseInt(style.zIndex) : 0;
      zIndex = !isNaN(parsed) ? parsed : 0;
    }
    return zIndex;
  });
  return Math.max(...zIndices);
}

// Update the overlay following a change in opened state.
function openedChanged(/** @type {ReactiveElement} */ element) {
  if (element[internal.state].autoFocus) {
    if (element[internal.state].opened) {
      // Opened
      if (
        !element[restoreFocusToElementKey] &&
        document.activeElement !== document.body
      ) {
        // Remember which element had the focus before we were opened.
        element[restoreFocusToElementKey] = document.activeElement;
      }
      // Focus on the element itself (if it's focusable), or the first focusable
      // element inside it.
      // TODO: We'd prefer to require that overlays (like the Overlay base
      // class) make use of delegatesFocus via DelegateFocusMixin, which would
      // let us drop the need for this mixin here to do anything special with
      // focus. However, an initial trial of this revealed an issue in
      // MenuButton, where invoking the menu did not put the focus on the first
      // menu item as expected. Needs more investigation.
      const focusElement = firstFocusableElement(element);
      if (focusElement) {
        focusElement.focus();
      }
    } else {
      // Closed
      if (element[restoreFocusToElementKey]) {
        // Restore focus to the element that had the focus before the overlay was
        // opened.
        element[restoreFocusToElementKey].focus();
        element[restoreFocusToElementKey] = null;
      }
    }
  }
}
