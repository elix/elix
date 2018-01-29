import * as symbols from './symbols.js';


/**
 * Mixin which maps swipe gestures to direction semantics.
 * 
 * @module SwipeDirectionMixin
 */
export default function SwipeDirectionMixin(Base) {

  // The class prototype added by the mixin.
  return class SwipeDirection extends Base {

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

  }
}
