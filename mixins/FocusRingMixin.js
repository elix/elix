//
// Global state shared by all elements using this mixin.
//

// We assume that the keyboard changed the focus unless we have proof otherwise.
let focusedWithKeyboard = true;

// Flag used to track keyboard focus state across window blur/focus events.
let previousFocusedWithKeyboard = false;

let listeningToWindowFocus = false;


/**
 * Adds a `focus-ring` class to the element when (and only when) it receives
 * focus via the keyboard. This is useful for buttons and other components that
 * don't generally show a focus ring for mouse/touch interaction.
 *
 * The following demo shows button that display a focus ring only when
 * you move the focus onto them via the keyboard, and not with the mouse or touch.
 *
 * [Button components using FocusRingMixin](/demos/focusRing.html)
 *
 * This is inspired by work on the `:focus-ring` pseudo-selector.
 * See https://github.com/wicg/focus-ring for details.
 *
 * This mixin manages a `focus-ring` class on an element that be used to
 * suppress the default focus ring unless the keyboard was used. The element's
 * stylesheet should include a CSS rule of the form:
 *
 *     :host(:focus:not(.focus-ring)) {
 *       outline: none;
 *     }
 *
 * An example of an element using `FocusRingMixin` is
 * [LabeledTabButton](LabeledTabButton).
 *
 * @module FocusRingMixin
 * @param base {Class} - The base class to extend
 * @returns {Class} The extended class
 */
export default function FocusRingMixin(base) {

  // The class prototype added by the mixin.
  class FocusRing extends base {
    constructor() {
      super();

      // We only want to start listening to window focus events if an element
      // using this mixin is actually instantiated, and we only do that for the
      // first such element. All elements can share that window focus listeners.
      if (!listeningToWindowFocus) {
        window.addEventListener('focus', windowFocused);

        // Firefox does not appear to listen to focus events on the window.
        // We listen to focus events on the document instead. There does not
        // appear to be a browser that listens to focus on both window and
        // document, so wiring up focus listeners to both seems to be safe.
        document.addEventListener('focus', windowFocused);

        listeningToWindowFocus = true;
      }

      this.addEventListener('focus', event => {
        this.classList.toggle('focus-ring', focusedWithKeyboard);

        // Remember how focus changed in case window loses focus.
        previousFocusedWithKeyboard = focusedWithKeyboard;

        // Go back to assuming use of the keyboard.
        focusedWithKeyboard = true;
      });

      this.addEventListener('mousedown', event => {
        // If this element receives focus, it won't be because of the keyboard.
        focusedWithKeyboard = false;
      });

      this.addEventListener('blur', event => {
        this.classList.remove('focus-ring');
      });
    }
  }

  return FocusRing;
}


// The window has regained focus after having lost it. If the last
// element that had the focus obtained the focus via the keyboard,
// set our keyboard input flag. That previously-focused element is
// about to receive a focus event, and the handler for that can then
// treat the situation as if the focus was obtained via the keyboard.
// That helps a keyboard user reacquire the focused element when
// returning to the window.
function windowFocused() {
  focusedWithKeyboard = previousFocusedWithKeyboard;
}
