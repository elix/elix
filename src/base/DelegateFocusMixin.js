import { firstFocusableElement } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { delegatesFocus, focusTarget, shadowRoot } from "./internal.js";

/**
 * Delegates a component's focus to its first focusable shadow element.
 *
 * This mixin serves as a polyfill for the standard `delegatesFocus` shadow root
 * property. As of June 2020, that property is still only natively supported in
 * Chrome. The Chrome delegatesFocus implementation has some subtle issues;
 * until additional implementations are available, it's hard to know whether the
 * issues are with the definition of delegatesFocus, with Chrome's
 * implementation, or with Elix component code. Accordingly, for the time being
 * this polyfill is used even on Chrome.
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
    get [delegatesFocus]() {
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
      // On browsers that support delegatesFocus natively, we should just be
      // able to let the browser handle the focus method. However, we hit a bug
      // in June 2020 where the native focus method in Chrome did not always
      // produce the expected results if delegatesFocus is set.
      //
      // Specific bug: a PopupButton would like to delegates focus to its source
      // button. Tabbing to a PopupButton focused on the source button as
      // expected. Moreover, programmatically setting focus on the button also
      // worked. However, when a PopupButton's popup was closed with the Escape
      // key, OverlayMixin attemped to set programmatically focus to the
      // PopupButton. This did *not* work as expecte, and focus ended up on the
      // body. Until we have a second native implementation to compare against,
      // it's difficult to determine whether this is a bug in the definition of
      // delegatesFocus, Chrome's implementation, or our code.

      // /** @type {any} */ const cast = this[shadowRoot];
      // if (cast.delegatesFocus) {
      //   // Native support for delegatesFocus, so don't need to do anything.
      //   super.focus(focusOptions);
      //   return;
      // }
      const focusElement = this[focusTarget];
      if (focusElement) {
        focusElement.focus(focusOptions);
      }
    }

    get [focusTarget]() {
      // HACK: The commented-out code lets us rely on the browser to indicate
      // which element should be focused on in browsers that don't support
      // native delegatesFocus. However, this code creates subtle focus problems
      // in components like AutoCompleteListBox: if the user clicks the toggle
      // button, the focus won't be placed on the top-level AutoCompleteComboBox
      // as expected; that element will be returned as the focus target, but if
      // it doesn't have a non-negative tabindex, forwardFocus won't think it's
      // focusable. A more correct solution would be for all components that are
      // focusable to give themselves a tabIndex of 0 by default or define a new
      // public `focusable` that components could use to indicate that they're
      // focusable. Until we have time to fully explore that, we workaround the
      // bug by providing the polyfill behavior even in browsers that have
      // delegatesFocus.

      // /** @type {any} */ const cast = this[shadowRoot];
      // return cast.delegatesFocus
      //   ? this
      //   : firstFocusableElement(this[shadowRoot]);
      return firstFocusableElement(this[shadowRoot]);
    }
  }

  return DelegateFocus;
}
