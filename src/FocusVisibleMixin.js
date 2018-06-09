import { merge } from './updates.js';


// We consider the keyboard to be active if the window has received a keydown
// event since the last mousedown event.
let keyboardActive = false;

const focusVisibleChangedListenerKey = Symbol('focusVisibleChangedListener');


/**
 * Mixin which tracks a component's focus state so that it can render a focus
 * indication (e.g., a glowing outline) if and only if the keyboard is active.
 * The keyboard is considered to be active if a keyboard event has occurred
 * since the last mouse/touch event.
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
      this.addEventListener('blur', () => {
        this.setState({
          focusVisible: false
        });
        document.removeEventListener('focus-visible-changed',
          this[focusVisibleChangedListenerKey]);
      });
      this.addEventListener('focus', () => {
        this.setState({
          focusVisible: keyboardActive
        });
        this[focusVisibleChangedListenerKey] = () => refreshFocus(this);
        document.addEventListener('focus-visible-changed',
          this[focusVisibleChangedListenerKey]);
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        focusVisible: false
      });
    }

    get updates() {
      const base = super.updates || {};
      // Suppress the component's normal `outline` style unless we know the
      // focus should be visible. If a base class (e.g., mixin further up the
      // prototype chain) has a different opinion about the outline, defer to
      // it.
      const outline = base.style && base.style.outline ||
        !this.state.focusVisible && 'none' ||
        null;
      return merge(base, {
        style: {
          outline
        }
      });
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
        focusVisible: !keyboardActive
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
