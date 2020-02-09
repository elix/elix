import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Maps direction keys to direction semantics.
 *
 * This mixin is useful for components that want to map direction keys (Left,
 * Right, etc.) to movement in the indicated direction (go left, go right,
 * etc.).
 *
 * This mixin expects the component to invoke a `keydown` method when a key is
 * pressed. You can use [KeyboardMixin](KeyboardMixin) for that
 * purpose, or wire up your own keyboard handling and call `keydown` yourself.
 *
 * This mixin calls methods such as `goLeft` and `goRight`. You can define
 * what that means by implementing those methods yourself. If you want to use
 * direction keys to navigate a selection, use this mixin with
 * [DirectionSelectionMixin](DirectionSelectionMixin).
 *
 * If the component defines a property called `orientation`, the value of that
 * property will constrain navigation to the horizontal or vertical axis.
 *
 * @module KeyboardDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function KeyboardDirectionMixin(Base) {
  // The class prototype added by the mixin.
  class KeyboardDirection extends Base {
    /**
     * Invoked when the user wants to go/navigate down.
     * The default implementation of this method does nothing.
     */
    [internal.goDown]() {
      if (super[internal.goDown]) {
        return super[internal.goDown]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate to the end (e.g., of a list).
     * The default implementation of this method does nothing.
     */
    [internal.goEnd]() {
      if (super[internal.goEnd]) {
        return super[internal.goEnd]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate left.
     * The default implementation of this method does nothing.
     */
    [internal.goLeft]() {
      if (super[internal.goLeft]) {
        return super[internal.goLeft]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate right.
     * The default implementation of this method does nothing.
     */
    [internal.goRight]() {
      if (super[internal.goRight]) {
        return super[internal.goRight]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate to the start (e.g., of a
     * list). The default implementation of this method does nothing.
     */
    [internal.goStart]() {
      if (super[internal.goStart]) {
        return super[internal.goStart]();
      }
    }

    /**
     * Invoked when the user wants to go/navigate up.
     * The default implementation of this method does nothing.
     */
    [internal.goUp]() {
      if (super[internal.goUp]) {
        return super[internal.goUp]();
      }
    }

    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;

      // Respect orientation state if defined, otherwise assume "both".
      const orientation = this[internal.state].orientation || "both";
      const horizontal = orientation === "horizontal" || orientation === "both";
      const vertical = orientation === "vertical" || orientation === "both";

      // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
      // as the user may be trying to navigate back or forward in the browser.
      switch (event.key) {
        case "ArrowDown":
          if (vertical) {
            handled = event.altKey
              ? this[internal.goEnd]()
              : this[internal.goDown]();
          }
          break;

        case "ArrowLeft":
          if (horizontal && !event.metaKey && !event.altKey) {
            handled = this[internal.goLeft]();
          }
          break;

        case "ArrowRight":
          if (horizontal && !event.metaKey && !event.altKey) {
            handled = this[internal.goRight]();
          }
          break;

        case "ArrowUp":
          if (vertical) {
            handled = event.altKey
              ? this[internal.goStart]()
              : this[internal.goUp]();
          }
          break;

        case "End":
          handled = this[internal.goEnd]();
          break;

        case "Home":
          handled = this[internal.goStart]();
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        handled ||
        (super[internal.keydown] && super[internal.keydown](event)) ||
        false
      );
    }
  }

  return KeyboardDirection;
}
