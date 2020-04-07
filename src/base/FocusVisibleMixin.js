import { deepContains } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

// We consider the keyboard to be active if the window has received a keydown
// event since the last mousedown event.
let keyboardActive = false;

/** @type {any} */
const focusVisibleChangedListenerKey = Symbol("focusVisibleChangedListener");

/**
 * Shows a focus indication if and only if the keyboard is active.
 *
 * The keyboard is considered to be active if a keyboard event has occurred
 * since the last mousedown event.
 *
 * This is loosely modeled after the proposed
 * [focus-visible](https://github.com/WICG/focus-visible) feature for CSS.
 *
 * @module FocusVisibleMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function FocusVisibleMixin(Base) {
  // The class prototype added by the mixin.
  return class FocusVisible extends Base {
    constructor() {
      // @ts-ignore
      super();

      // We listen to focusin/focusout instead of focus/blur because components
      // like Menu want to handle focus visiblity for the items they contain,
      // and those contained items can get the focus. Using focusin/focusout
      // lets us know whether this element *or any element it contains* has the
      // focus.
      //
      // Focus events are problematic in that they can occur during rendering:
      // if an element with the focus is updated so that its tabindex is
      // removed, it will lose focus. Since these focus handlers need to set
      // state, this could lead to setting state during rendering, which is bad.
      // To avoid this problem, we use promise timing to defer the setting of
      // state.
      this.addEventListener("focusout", event => {
        Promise.resolve().then(() => {
          // What has the focus now?
          /** @type {any} */ const cast = event;
          const newFocusedElement =
            cast.relatedTarget || document.activeElement;
          const isFocusedElement = this === newFocusedElement;
          const containsFocus = deepContains(this, newFocusedElement);
          const lostFocus = !isFocusedElement && !containsFocus;
          if (lostFocus) {
            this[internal.setState]({
              focusVisible: false
            });
            // No longer need to listen for changes in focus visibility.
            document.removeEventListener(
              "focus-visible-changed",
              this[focusVisibleChangedListenerKey]
            );
            this[focusVisibleChangedListenerKey] = null;
          }
        });
      });
      this.addEventListener("focusin", () => {
        Promise.resolve().then(() => {
          if (this[internal.state].focusVisible !== keyboardActive) {
            // Show the element as focused if the keyboard has been used.
            this[internal.setState]({
              focusVisible: keyboardActive
            });
          }
          if (!this[focusVisibleChangedListenerKey]) {
            // Listen to subsequent changes in focus visibility.
            this[focusVisibleChangedListenerKey] = () => refreshFocus(this);
            document.addEventListener(
              "focus-visible-changed",
              this[focusVisibleChangedListenerKey]
            );
          }
        });
      });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        focusVisible: false
      });
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }

      // Suppress the component's normal `outline` style unless we know the
      // focus should be visible.
      if (changed.focusVisible) {
        const { focusVisible } = this[internal.state];
        this.toggleAttribute("focus-visible", focusVisible);
      }
    }

    get [internal.template]() {
      const result = super[internal.template] || template.html``;
      result.content.append(html`
        <style>
          :host {
            outline: none;
          }

          :host([focus-visible]:focus-within) {
            outline-color: Highlight; /* Firefox */
            outline-color: -webkit-focus-ring-color; /* All other browsers */
            outline-style: auto;
          }
        </style>
      `);
      return result;
    }
  };
}

function refreshFocus(/** @type {ReactiveElement} */ element) {
  element[internal.setState]({
    focusVisible: keyboardActive
  });
}

function updateKeyboardActive(/** @type {boolean} */ newKeyboardActive) {
  if (keyboardActive !== newKeyboardActive) {
    keyboardActive = newKeyboardActive;
    const event = new CustomEvent("focus-visible-changed", {
      detail: {
        focusVisible: keyboardActive
      }
    });
    document.dispatchEvent(event);
  }
}

// Listen for top-level keydown and mousedown events.
// Use capture phase so we detect events even if they're handled.
window.addEventListener(
  "keydown",
  () => {
    updateKeyboardActive(true);
  },
  { capture: true }
);

window.addEventListener(
  "mousedown",
  () => {
    updateKeyboardActive(false);
  },
  { capture: true }
);
