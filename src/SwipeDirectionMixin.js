import * as symbols from './symbols.js';


/**
 * Map swipe gestures to direction semantics.
 * 
 * @module SwipeDirectionMixin
 */
export default function SwipeDirectionMixin(Base) {

  // The class prototype added by the mixin.
  return class SwipeDirection extends Base {

    /**
     * Invokes the [symbols.goDown](symbols#goDown) method.
     */
    [symbols.swipeDown]() {
      this[symbols.goDown]();
    }

    /**
     * Invokes the [symbols.goRight](symbols#goRight) method.
     */
    [symbols.swipeLeft]() {
      this[symbols.goRight]();
    }

    /**
     * Invokes the [symbols.goLeft](symbols#goLeft) method.
     */
    [symbols.swipeRight]() {
      this[symbols.goLeft]();
    }

    /**
     * Invokes the [symbols.goUp](symbols#goUp) method.
     */
    [symbols.swipeUp]() {
      this[symbols.goUp]();
    }

  }
}
