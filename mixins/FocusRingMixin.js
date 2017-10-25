import * as props from './props.js';


//
// Global state shared by all elements using this mixin.
//

// We assume that the keyboard changed the focus unless we have proof otherwise.
let focusedWithKeyboard = true;

// Flag used to track keyboard focus state across window blur/focus events.
let previousFocusedWithKeyboard;

// Shared event listener for all components using this mixin.
let windowFocusListener;


export default function FocusMixin(Base) {
  return class Focus extends Base {

    constructor() {
      super();
      this.addEventListener('blur', () => {
        this.setState({
          focusRing: false
        });
      });
      this.addEventListener('focus', () => {
        this.setState({
          focusRing: focusedWithKeyboard
        });

        // Remember how focus changed in case window loses focus.
        previousFocusedWithKeyboard = focusedWithKeyboard;

        // Go back to assuming use of the keyboard.
        focusedWithKeyboard = true;
      });
      this.addEventListener('mousedown', () => {
        // If an element receives focus, it won't be because of the keyboard.
        focusedWithKeyboard = false;
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
        focusRing: false
      });
    }

    hostProps(original) {
      const base = super.hostProps ? super.hostProps(original) : {};
      const outline = base.style && base.style.outline ||
          !this.state.focusRing && 'none' ||
          undefined;
      return props.merge(base, {
        style: {
          outline
        }
      });
    }

    // For use with KeyboardMixin
    keydown(event) {
      const result = super.keydown && super.keydown(event);
      if (!this.state.focusRing) {
        // User set focus on component with mouse, but is now using keyboard.
        this.setState({
          focusRing: true
        });
      }
      return result;
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
