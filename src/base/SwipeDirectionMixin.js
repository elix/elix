import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  goDown,
  goLeft,
  goRight,
  goUp,
  swipeDown,
  swipeLeft,
  swipeRight,
  swipeUp,
} from "./internal.js";

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
     * Invokes the [goUp](internal#internal.goUp) method.
     */
    [swipeDown]() {
      this[goUp]();
    }

    /**
     * Invokes the [goRight](internal#internal.goRight) method.
     */
    [swipeLeft]() {
      this[goRight]();
    }

    /**
     * Invokes the [goLeft](internal#internal.goLeft) method.
     */
    [swipeRight]() {
      this[goLeft]();
    }

    /**
     * Invokes the [goDown](internal#internal.goDown) method.
     */
    [swipeUp]() {
      this[goDown]();
    }
  };
}
