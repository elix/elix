import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  goFirst,
  goLast,
  goNext,
  goPrevious,
  itemsDelegate,
  setState,
} from "./internal.js";

/**
 * has the effect of adding the component to the tab order in document order.
 *
 * @module DelegateCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DelegateCursorMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateCursor extends Base {
    [goFirst]() {
      return delegateCursorOperation(this, goFirst);
    }

    [goLast]() {
      return delegateCursorOperation(this, goLast);
    }

    [goNext]() {
      return delegateCursorOperation(this, goNext);
    }

    [goPrevious]() {
      return delegateCursorOperation(this, goPrevious);
    }
  }

  return DelegateCursor;
}

function delegateCursorOperation(element, operation) {
  /** @type {any} */ const cast = element[itemsDelegate];
  if (!cast[operation]) {
    return false;
  }

  const changed = cast[operation]();
  if (changed) {
    const currentIndex = cast.currentIndex;
    element[setState]({ currentIndex });
  }

  return changed;
}
