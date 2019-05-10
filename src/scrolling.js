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
 * If the given element can be scrolled, return that. If not, return the closest
 * ancestor that can be scrolled. If no such ancestor is found, return null.
 * 
 * @param {Element} element
 * @returns {Element|null}
 */
export function getScrollableElement(element) {
  if (element instanceof ShadowRoot) {
    // Didn't find a scrollable ancestor.
    return null;
  }
  const style = getComputedStyle(element);
  const overflowX = style.overflowX;
  const overflowY = style.overflowY;
  if (overflowX === 'scroll' || overflowX === 'auto' ||
      overflowY === 'scroll' || overflowY === 'auto') {
    // Found an element that can scroll.
    return element;
  }
  // Keep looking higher in the hierarchy for a scrollable ancestor.
  return element.parentNode instanceof Element ?
    getScrollableElement(element.parentNode) :
    null;
}
