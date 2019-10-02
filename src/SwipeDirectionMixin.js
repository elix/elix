import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

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
     * Invokes the [internal.goUp](symbols#goUp) method.
     */
    [internal.swipeDown]() {
      this[internal.goUp]();
    }

    /**
     * Invokes the [internal.goRight](symbols#goRight) method.
     */
    [internal.swipeLeft]() {
      this[internal.goRight]();
    }

    /**
     * Invokes the [internal.goLeft](symbols#goLeft) method.
     */
    [internal.swipeRight]() {
      this[internal.goLeft]();
    }

    /**
     * Invokes the [internal.goDown](symbols#goDown) method.
     */
    [internal.swipeUp]() {
      this[internal.goDown]();
    }
  };
}
