import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  defaultTabIndex,
  delegatesFocus,
  keydown,
  raiseChangeEvents,
  render,
  rendering,
  setState,
  state,
} from "./internal.js";

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
 *     [keydown](event) {
 *       let handled;
 *       switch (event.key) {
 *         // Handle the keys you want, setting handled = true if appropriate.
 *       }
 *       // Prefer mixin result if it's defined, otherwise use base result.
 *       return handled || (super[keydown] && super[keydown](event));
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
      this.addEventListener("keydown", async (event) => {
        this[raiseChangeEvents] = true;
        // For use with FocusVisibleMixin.
        if (!this[state].focusVisible) {
          // The user may have begun interacting with this element using the
          // mouse/touch, but has now begun using the keyboard, so show focus.
          this[setState]({
            focusVisible: true,
          });
        }
        const handled = this[keydown](event);
        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        await Promise.resolve();
        this[raiseChangeEvents] = false;
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "tabindex") {
        // Parse the passed value, which could be a string or null.
        let parsed;
        if (newValue === null) {
          // tabindex attribute was removed.
          parsed = -1;
        } else {
          parsed = Number(newValue);
          if (isNaN(parsed)) {
            // Non-numeric tabindex falls back to default value (if defined).
            parsed = this[defaultTabIndex] ? this[defaultTabIndex] : 0;
          }
        }
        this.tabIndex = parsed;
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    get [defaultState]() {
      // If we're using DelegateFocusMixin, we don't need or want to set a
      // tabindex on the host; we'll rely on the inner shadow elements to take
      // the focus and raise keyboard events. Otherwise, we do set a tabindex on
      // the host, so that we can get keyboard events.
      const tabIndex = this[delegatesFocus] ? null : 0;
      const state = Object.assign(super[defaultState] || {}, {
        tabIndex,
      });

      return state;
    }

    /**
     * See the [symbols](internal#internal.keydown) documentation for details.
     */
    [keydown](/** @type {KeyboardEvent} */ event) {
      if (super[keydown]) {
        return super[keydown](event);
      }
      return false;
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }
      if (changed.tabIndex) {
        this.tabIndex = this[state].tabIndex;
      }
    }

    // Record our own notion of the state of the tabIndex property so we can
    // rerender if necessary.
    get tabIndex() {
      return super.tabIndex;
    }
    set tabIndex(tabIndex) {
      // If value has changed, invoke the super setter.
      if (super.tabIndex !== tabIndex) {
        super.tabIndex = tabIndex;
      }

      // The tabIndex setter can get called during rendering when we render our
      // own notion of the tabIndex state, in which case we don't need or want
      // to set state again.
      if (!this[rendering]) {
        // Record the new tabIndex in our state.
        this[setState]({
          tabIndex,
        });
      }
    }
  }

  return Keyboard;
}
