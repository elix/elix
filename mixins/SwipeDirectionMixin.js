import symbols from './symbols.js';


export default function SwipeDirectionMixin(Base) {
  return class SwipeDirection extends Base {

    swipeLeft() {
      this[symbols.goRight]();
    }

    swipeRight() {
      this[symbols.goLeft]();
    }

  }
}
