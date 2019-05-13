import { firstFocusableElement } from './utilities.js';
import * as symbols from './symbols.js';


/**
 * Delegates a component's focus to its first focusable shadow element.
 * 
 * This mixin serves as a polyfill for the standard `delegatesFocus` shadow
 * root property. As of April 2019, that property is only supported in Chrome.
 * 
 * @module DelegateFocusMixin
 */
export default function DelegateFocusMixin(Base) {

  // The class prototype added by the mixin.
  class DelegateFocus extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      // The delegatesFocus spec says that the focus outline should be shown on
      // both the host and the focused subelement — which seems confusing and
      // (in our opinion) looks ugly. If the browser supports delegatesFocus we
      // suppress the host focus outline.
      if (this.shadowRoot.delegatesFocus) {
        this.style.outline = 'none';
      }
    }

    /**
     * Returns true if the component is delegating its focus.
     * 
     * A component using `DelegateFocusMixin` will always have this property be
     * true unless a class takes measures to override it.
     * 
     * @type {boolean}
     * @default true
     */
    get [symbols.delegatesFocus]() {
      return true;
    }

    // If someone tries to put the focus on us, delegate the focus to the first
    // focusable element in the composed tree below our shadow root.
    focus(focusOptions) {
      if (this.shadowRoot.delegatesFocus) {
        // Native support for delegatesFocus, so don't need to do anything.
        super.focus(focusOptions);
        return;
      }
      const focusElement = this[symbols.focusTarget];
      if (focusElement) {
        focusElement.focus(focusOptions);
      }
    }

    get [symbols.focusTarget]() {
      return this.shadowRoot.delegatesFocus ?
        this :
        firstFocusableElement(this.shadowRoot);
    }

  }

  return DelegateFocus;

}
