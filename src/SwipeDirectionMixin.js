import symbols from './symbols.js';


/**
 * Mixin which maps swipe gestures to direction semantics.
 * 
 * @module SwipeDirectionMixin
 */
export default function SwipeDirectionMixin(Base) {

  // The class prototype added by the mixin.
  return class SwipeDirection extends Base {

    swipeLeft() {
      this[symbols.goRight]();
    }

    swipeRight() {
      this[symbols.goLeft]();
    }

  }
}
