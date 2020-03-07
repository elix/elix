import { firstFocusableElement } from "../core/dom.js";
import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Delegates a component's focus to its first focusable shadow element.
 *
 * This mixin serves as a polyfill for the standard `delegatesFocus` shadow
 * root property. As of April 2019, that property is only supported in Chrome.
 *
 * @module DelegateFocusMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DelegateFocusMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateFocus extends Base {
    /**
     * Returns true if the component is delegating its focus.
     *
     * A component using `DelegateFocusMixin` will always have this property be
     * true unless a class takes measures to override it.
     *
     * @type {boolean}
     * @default true
     */
    get [internal.delegatesFocus]() {
      return true;
    }

    /**
     * If someone tries to put the focus on us, delegate the focus to the first
     * focusable element in the composed tree below our shadow root.
     *
     * @ignore
     * @param {FocusOptions=} focusOptions
     */
    focus(focusOptions) {
      /** @type {any} */ const cast = this[internal.shadowRoot];
      if (cast.delegatesFocus) {
        // Native support for delegatesFocus, so don't need to do anything.
        super.focus(focusOptions);
        return;
      }
      const focusElement = this[internal.focusTarget];
      if (focusElement) {
        focusElement.focus(focusOptions);
      }
    }

    get [internal.focusTarget]() {
      // HACK: The commented-out code lets us rely on the browser to indicate
      // which element should be focused on in browsers that don't support
      // native delegatesFocus. However, this code creates subtle focus problems
      // in components like AutoCompleteListBox: if the user clicks the toggle
      // button, the focus won't be placed on the top-level AutoCompleteComboBox
      // as expected; that element will be returned as the focus target, but if
      // it doesn't have a non-negative tabindex, forwardFocus won't think it's
      // focusable. A more correct solution would be for all components that are
      // focusable to give themselves a tabIndex of 0 by default. Until we have
      // to fully explore that, we workaround the bug by providing the polyfill
      // behavior even in browsers that have delegatesFocus.

      // /** @type {any} */ const cast = this[internal.shadowRoot];
      // return cast.delegatesFocus
      //   ? this
      //   : firstFocusableElement(this[internal.shadowRoot]);
      return firstFocusableElement(this[internal.shadowRoot]);
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (this[internal.firstRender]) {
        // The delegatesFocus spec says that the focus outline should be shown
        // on both the host and the focused subelement — which seems confusing
        // and (in our opinion) looks ugly. If the browser supports
        // delegatesFocus we suppress the host focus outline.
        if (/** @type {any} */ (this[internal.shadowRoot]).delegatesFocus) {
          this.style.outline = "none";
        }
      }
    }
  }

  return DelegateFocus;
}
