import { merge } from './updates.js';
import * as symbols from './symbols.js';


//
// Global state shared by all elements using this mixin.
//

// We consider the keyboard to be active if the window has received a keydown
// event since the last mousedown event.
let keyboardActive = false;

// Flag used to track keyboard active state across window blur/focus events.
let previousKeyboardActive;


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
        this[symbols.refreshFocus]();
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        focusVisible: false
      });
    }

    [symbols.refreshFocus]() {
      this.setState({
        focusVisible: keyboardActive
      });    
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


window.addEventListener('mousedown', () => {
  keyboardActive = false;
}, { capture: true });
window.addEventListener('keydown', () => {
  keyboardActive = true;
}, { capture: true });
