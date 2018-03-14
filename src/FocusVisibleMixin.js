import { merge } from './updates.js';
import * as symbols from './symbols.js';


//
// Global state shared by all elements using this mixin.
//

// We assume that the keyboard changed the focus unless we have proof otherwise.
let focusedWithKeyboard = true;

// Flag used to track keyboard focus state across window blur/focus events.
let previousFocusedWithKeyboard;

// Shared event listener for all components using this mixin.
let windowFocusListener;


/**
 * Mixin which tracks a component's focus state so that it can render a focus
 * indication (e.g., a glowing outline) if and only if the user has used the
 * keyboard to interact with the component.
 * 
 * This is modeled after the proposed
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
      this.addEventListener('blur', () => {
        this.setState({
          focusVisible: false
        });
      });
      this.addEventListener('focus', () => {
        this.setState({
          focusVisible: focusedWithKeyboard
        });

        // Remember how focus changed in case window loses focus.
        previousFocusedWithKeyboard = focusedWithKeyboard;

        // Go back to assuming use of the keyboard.
        focusedWithKeyboard = true;
      });
      this.addEventListener('mousedown', () => {
        if (!this.matches(':focus')) {
          // If this element ultimately receives the focus, it won't be because
          // of the keyboard.
          focusedWithKeyboard = false;
        }
      });

      // We only want to start listening to window focus events if an element
      // using this mixin is actually instantiated, and we only do that for the
      // first such element. All elements can share that window focus listeners.
      if (windowFocusListener == null) {
        windowFocusListener = window.addEventListener('focus', windowFocused);

        // Firefox does not appear to listen to focus events on the window.
        // We listen to focus events on the document instead. There does not
        // appear to be a browser that listens to focus on both window and
        // document, so wiring up focus listeners to both seems to be safe.
        document.addEventListener('focus', windowFocused);
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        focusVisible: false
      });
    }

    // For use with KeyboardMixin
    [symbols.keydown](event) {
      const result = super[symbols.keydown] && super[symbols.keydown](event);
      if (!this.state.focusVisible) {
        // User set focus on component with mouse, but is now using keyboard.
        previousFocusedWithKeyboard = true;
        this.setState({
          focusVisible: true
        });
      }
      return result;
    }

    get updates() {
      const base = super.updates || {};
      const outline = base.style && base.style.outline ||
        !this.state.focusVisible && 'none' ||
        undefined;
      return merge(base, {
        style: {
          outline
        }
      });
    }
  }
}


// The window has regained focus after having lost it. If the last element that
// had the focus obtained the focus via the keyboard, set our keyboard input
// flag. That previously-focused element is about to receive a focus event, and
// the handler for that can then treat the situation as if the focus was
// obtained via the keyboard. That helps a keyboard user reacquire the focused
// element when returning to the window.
function windowFocused() {
  focusedWithKeyboard = previousFocusedWithKeyboard;
}
