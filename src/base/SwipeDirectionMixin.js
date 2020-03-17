import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Map swipe gestures to direction semantics.
 *
 * @module SwipeDirectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SwipeDirectionMixin(Base) {
  // The class prototype added by the mixin.
  return class SwipeDirection extends Base {
    /**
     * Invokes the [internal.goUp](internal#internal.goUp) method.
     */
    [internal.swipeDown]() {
      this[internal.goUp]();
    }

    /**
     * Invokes the [internal.goRight](internal#internal.goRight) method.
     */
    [internal.swipeLeft]() {
      this[internal.goRight]();
    }

    /**
     * Invokes the [internal.goLeft](internal#internal.goLeft) method.
     */
    [internal.swipeRight]() {
      this[internal.goLeft]();
    }

    /**
     * Invokes the [internal.goDown](internal#internal.goDown) method.
     */
    [internal.swipeUp]() {
      this[internal.goDown]();
    }
  };
}
