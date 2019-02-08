import { firstFocusableElement } from "./utilities";
import { merge } from "./updates";


/**
 * @module DelegateFocusMixin
 */
export default function DelegateFocusMixin(Base) {

  // The class prototype added by the mixin.
  class DelegateFocus extends Base {

    get delegatesFocus() {
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
      const focusElement = firstFocusableElement(this.shadowRoot);
      if (focusElement) {
        focusElement.focus(focusOptions);
      }
    }

    get updates() {
      // The delegatesFocus spec says that the focus outline should be shown on
      // both the host and the focused subelement — which seems confusing and
      // (in our opinion) looks ugly. If the browser supports delegatesFocus we
      // suppress the host focus outline.
      const updates = this.shadowRoot.delegatesFocus ?
        {
          style: {
            outline: 'none'
          }
        } :
        null;
      return merge(super.updates, updates);
    }

  }

  return DelegateFocus;

}
