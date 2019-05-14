import { deepContains } from './utilities.js';
import * as symbols from './symbols.js';


// We consider the keyboard to be active if the window has received a keydown
// event since the last mousedown event.
let keyboardActive = false;

/** @type {any} */
const focusVisibleChangedListenerKey = Symbol('focusVisibleChangedListener');


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
      this.addEventListener('focusout', event => {
        Promise.resolve().then(() => {
          // What has the focus now?
          const newFocusedElement = event.relatedTarget || document.activeElement;
          const isFocusedElement = this === newFocusedElement;
          /** @type {any} */
          const cast = this;
          const containsFocus = deepContains(cast, newFocusedElement);
          const lostFocus = !isFocusedElement && !containsFocus;
          if (lostFocus) {
            this.setState({
              focusVisible: false
            });
            // No longer need to listen for changes in focus visibility.
            document.removeEventListener('focus-visible-changed',
              this[focusVisibleChangedListenerKey]);
            this[focusVisibleChangedListenerKey] = null;
          }
        });
      });
      this.addEventListener('focusin', () => {
        Promise.resolve().then(() => {
          if (this.state.focusVisible !== keyboardActive) {
            // Show the element as focused if the keyboard has been used.
            this.setState({
              focusVisible: keyboardActive
            });
          }
          if (!this[focusVisibleChangedListenerKey]) {
            // Listen to subsequent changes in focus visibility.
            this[focusVisibleChangedListenerKey] = () => refreshFocus(this);
            document.addEventListener('focus-visible-changed',
              this[focusVisibleChangedListenerKey]);
          }
        });
      });
    }

    get defaultState() {
      return Object.assign(super.defaultState, {
        focusVisible: false
      });
    }

    [symbols.render](changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }
      if (changed.focusVisible) {
        // Suppress the component's normal `outline` style unless we know the
        // focus should be visible.
        this.style.outline = this.state.focusVisible ? '' : 'none';
      }
    }

    /**
     * Temporarily suppress visibility of the keyboard focus until the next
     * keydown event.
     * 
     * This can be useful in components like [Menu](Menu) that actively manage
     * where the focus is in response to mouse hover activity. If the user uses
     * the keyboard to invoke a menu, then changes to using the mouse, it can be
     * distracting to see the focus indicator moving as well. In such
     * situations, the component can invoke this method (e.g., in response to
     * `mousemove`) to temporarily suppress focus visibility.
     */
    suppressFocusVisibility() {
      keyboardActive = false;
      refreshFocus(this);
    }
  }
}


function refreshFocus(element) {
  element.setState({
    focusVisible: keyboardActive
  });
}


function updateKeyboardActive(newKeyboardActive) {
  if (keyboardActive !== newKeyboardActive) {
    keyboardActive = newKeyboardActive;
    const event = new CustomEvent('focus-visible-changed', {
      detail: {
        focusVisible: keyboardActive
      }
    });
    document.dispatchEvent(event);
  }
}


// Listen for top-level keydown and mousedown events.
// Use capture phase so we detect events even if they're handled.
window.addEventListener('keydown', () => {
  updateKeyboardActive(true);
}, { capture: true });

window.addEventListener('mousedown', () => {
  updateKeyboardActive(false);
}, { capture: true });
