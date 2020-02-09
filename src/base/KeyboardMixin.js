import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Manages keyboard handling for a component.
 *
 * This mixin handles several keyboard-related features.
 *
 * First, it wires up a single keydown event handler that can be shared by
 * multiple mixins on a component. The event handler will invoke a `keydown`
 * method with the event object, and any mixin along the prototype chain that
 * wants to handle that method can do so.
 *
 * If a mixin wants to indicate that keyboard event has been handled, and that
 * other mixins should *not* handle it, the mixin's `keydown` handler should
 * return a value of true. The convention that seems to work well is that a
 * mixin should see if it wants to handle the event and, if not, then ask the
 * superclass to see if it wants to handle the event. This has the effect of
 * giving the mixin that was applied last the first chance at handling a
 * keyboard event.
 *
 * Example:
 *
 *     [internal.keydown](event) {
 *       let handled;
 *       switch (event.key) {
 *         // Handle the keys you want, setting handled = true if appropriate.
 *       }
 *       // Prefer mixin result if it's defined, otherwise use base result.
 *       return handled || (super[internal.keydown] && super[internal.keydown](event));
 *     }
 *
 * A second feature provided by this mixin is that it implicitly makes the
 * component a tab stop if it isn't already, by setting `tabindex` to 0. This
 * has the effect of adding the component to the tab order in document order.
 *
 * @module KeyboardMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function KeyboardMixin(Base) {
  // The class prototype added by the mixin.
  class Keyboard extends Base {
    constructor() {
      // @ts-ignore
      super();
      this.addEventListener("keydown", async event => {
        this[internal.raiseChangeEvents] = true;
        // For use with FocusVisibleMixin.
        if (!this[internal.state].focusVisible) {
          // The user may have begun interacting with this element using the
          // mouse/touch, but has now begun using the keyboard, so show focus.
          this[internal.setState]({
            focusVisible: true
          });
        }
        const handled = this[internal.keydown](event);
        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        await Promise.resolve();
        this[internal.raiseChangeEvents] = false;
      });
    }

    get [internal.defaultState]() {
      // If we're using DelegateFocusMixin, we don't need or want to set a
      // tabindex on the host; we'll rely on the inner shadow elements to take
      // the focus and raise keyboard events. Otherwise, we do set a tabindex on
      // the host, so that we can get keyboard events.
      const tabIndex = this[internal.delegatesFocus] ? null : 0;
      const state = Object.assign(super[internal.defaultState], {
        tabIndex
      });

      return state;
    }

    /**
     * See the [symbols](symbols#keydown) documentation for details.
     */
    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      if (super[internal.keydown]) {
        return super[internal.keydown](event);
      }
      return false;
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.tabIndex) {
        this.tabIndex = this[internal.state].tabIndex;
      }
    }

    // Record our own notion of the state of the tabIndex property so we can
    // rerender if necessary.
    get tabIndex() {
      return super.tabIndex;
    }
    set tabIndex(tabIndex) {
      // Parse the passed value, which could be a string or null.
      let parsed = tabIndex !== null ? Number(tabIndex) : null;
      if (parsed !== null && isNaN(parsed)) {
        const defaultTabIndex = this[internal.defaultTabIndex];
        parsed = defaultTabIndex ? defaultTabIndex : 0;
      }

      // If parsed value isn't null and has changed, invoke the super setter.
      if (parsed !== null && super.tabIndex !== parsed) {
        super.tabIndex = parsed;
      }

      // The tabIndex setter can get called during rendering when we render our
      // own notion of the tabIndex state, in which case we don't need or want
      // to set state again.
      if (!this[internal.rendering]) {
        // Record the new tabIndex in our state.
        this[internal.setState]({
          tabIndex: parsed
        });
      }
    }
  }

  return Keyboard;
}
