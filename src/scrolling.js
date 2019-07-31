import { composedAncestors } from "./utilities.js";


/**
 * Utilities for working with scrolling.
 * 
 * @module defaultScrollTarget
 */


/**
 * This helper returns a guess as to what portion of the given element can be
 * scrolled. This is used by [SelectionInViewMixin](SelectionInViewMixin) to
 * provide a default implementation of [symbols.scrollTarget].
 *
 * If the element has a shadow root containing a default (unnamed) slot, this
 * returns the first ancestor of that slot that has either `overflow-x` or
 * `overflow-y` styled as `auto` or `scroll`. If the element has no default
 * slot, or no scrolling ancestor is found, the element itself is returned.
 *
 * @param {Element} element – the component to examine for a scrolling
 * element
 * @returns {Element}
 */
export function defaultScrollTarget(element) {
  const root = element.shadowRoot;
  const slot = root && root.querySelector('slot:not([name])');
  const scrollingParent = slot && slot.parentNode instanceof Element &&
    getScrollableElement(slot.parentNode);
  return scrollingParent || element;
}


/**
 * Return true if the given element can be scrolled.
 * 
 * @private
 * @param {HTMLElement} element 
 */
function isElementScrollable(element) {
  const style = getComputedStyle(element);
  const overflowX = style.overflowX;
  const overflowY = style.overflowY;
  return (overflowX === 'scroll' || overflowX === 'auto' ||
      overflowY === 'scroll' || overflowY === 'auto');
}


/**
 * If the given element can be scrolled, return that. If not, return the closest
 * ancestor that can be scrolled. If no such ancestor is found, return null.
 * 
 * @param {Element} node
 * @returns {Element|null}
 */
export function getScrollableElement(node) {
  if (node instanceof HTMLElement && isElementScrollable(node)) {
    return node;
  }
  for (const ancestor of composedAncestors(node)) {
    if (ancestor instanceof HTMLElement && isElementScrollable(ancestor)) {
      return ancestor;
    }
  }
  return null;
}


export function willGestureScroll(target, orientation, delta) {
  if (target instanceof ShadowRoot) {
    // Didn't find a scrollable ancestor.
    return false;
  }
  const style = getComputedStyle(target);
  const vertical = orientation === 'vertical';
  const scrollAxisMatch =
    (vertical &&
      (style.overflowY === 'scroll' || style.overflowY === 'auto')) ||
    (!vertical &&
      (style.overflowX === 'scroll' || style.overflowX === 'auto'));
  if (scrollAxisMatch) {
    // Found an target that can potentially scroll in this orientation.
    const scrollEdge = vertical ? 'scrollTop' : 'scrollLeft';
    if (delta < 0 && target[scrollEdge] > 0) {
      // Target has room to scroll up or left.
      return true;
    }
    const scrollLength = vertical ? 'scrollHeight' : 'scrollWidth';
    const clientLength = vertical ? 'clientHeight' : 'clientWidth';
    const scrollMax = target[scrollLength] + target[clientLength];
    if (delta > 0 && target[scrollEdge] < scrollMax) {
      // Target has room to scroll down or right.
      return true;
    }
  }
  // Keep looking higher in the hierarchy for a scrollable ancestor.

  // TODO: Walk up shadow host
  return target.parentNode instanceof Element ?
    willGestureScroll(target.parentNode, orientation, delta) :
    false;
}
