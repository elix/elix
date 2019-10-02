import { selfAndComposedAncestors } from './utilities.js';

/**
 * Utilities for working with scrolling.
 *
 * @module defaultScrollTarget
 */

/**
 * Returns true if the given target or any of its ancestors can be scrolled
 * in the indicated direction.
 *
 * This is used, e.g., by gesture event handlers to predict if the default
 * behavior for a given event is likely to result in scrolling.
 *
 * @param {EventTarget} target
 * @param {'horizontal'|'vertical'} orientation
 * @param {boolean} downOrRight
 */
export function canScrollInDirection(target, orientation, downOrRight) {
  if (!(target instanceof Node)) {
    return false;
  }
  for (const ancestor of selfAndComposedAncestors(target)) {
    if (ancestor instanceof HTMLElement) {
      const style = getComputedStyle(ancestor);
      const vertical = orientation === 'vertical';
      const scrollAxisMatch =
        (vertical &&
          (style.overflowY === 'scroll' || style.overflowY === 'auto')) ||
        (!vertical &&
          (style.overflowX === 'scroll' || style.overflowX === 'auto'));
      if (scrollAxisMatch) {
        // Found an ancestor that can potentially scroll in this orientation.
        const scrollEdge = vertical ? 'scrollTop' : 'scrollLeft';
        if (!downOrRight && ancestor[scrollEdge] > 0) {
          // Target has room to scroll up or left.
          return true;
        }
        const scrollLength = vertical ? 'scrollHeight' : 'scrollWidth';
        const clientLength = vertical ? 'clientHeight' : 'clientWidth';
        const scrollMax = ancestor[scrollLength] - ancestor[clientLength];
        if (downOrRight && ancestor[scrollEdge] < scrollMax) {
          // Target has room to scroll down or right.
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * This helper returns a guess as to what portion of the given element can be
 * scrolled. This is used by [SelectionInViewMixin](SelectionInViewMixin) to
 * provide a default implementation of [internal.scrollTarget].
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
  const scrollingParent =
    slot &&
    slot.parentNode instanceof Element &&
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
  return (
    overflowX === 'scroll' ||
    overflowX === 'auto' ||
    overflowY === 'scroll' ||
    overflowY === 'auto'
  );
}

/**
 * If the given element can be scrolled, return that. If not, return the closest
 * ancestor that can be scrolled. If no such ancestor is found, return null.
 *
 * @param {Element} node
 * @returns {Element|null}
 */
export function getScrollableElement(node) {
  for (const ancestor of selfAndComposedAncestors(node)) {
    if (ancestor instanceof HTMLElement && isElementScrollable(ancestor)) {
      return ancestor;
    }
  }
  return null;
}
