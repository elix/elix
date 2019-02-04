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
        {};
      return merge(super.updates, updates);
    }

  }

  return DelegateFocus;

}


// Return the first focusable element below the given root.
// FWIW, we try to approxiate the browser's sequential navigation algorithm, but
// such things tend to include edge cases we may have missed.
function firstFocusableElement(root) {
  // CSS selectors for focusable elements from
  // https://stackoverflow.com/a/30753870/76472
  const focusableQuery = 'a[href],area[href],button:not([disabled]),details,iframe,input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[contentEditable="true"],[tabindex]';
  const potentialElements = root.querySelectorAll(focusableQuery);
  // Only consider elements with a positive tabindex.
  const focusableElements = Array.prototype.filter.call(potentialElements, element =>
    element.tabIndex >= 0
  );
  // Sort by tabindex.
  const sortedElements = focusableElements.sort((a, b) =>
    a.tabIndex - b.tabIndex
  );
  return sortedElements[0];
}
