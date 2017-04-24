//
// Copyright © 2016-2017 Component Kitchen, Inc. and contributors to the 
// Elix Project
//

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
 * @param {HTMLElement} element – the component to examine for a scrolling
 * element
 * @type {HTMLElement}
 */
function defaultScrollTarget(element) {
  const root = element.shadowRoot;
  const slot = root && root.querySelector('slot:not([name])');
  const scrollingParent = slot && getScrollingParent(slot.parentNode);
  return scrollingParent || element;
}


// Return the parent of the given element that can be scrolled. If no such
// element is found, return null.
function getScrollingParent(element) {
  // We test against DocumentFragment below instead of ShadowRoot, because the
  // polyfill doesn't define the latter, and instead uses the former. In native
  // Shadow DOM, a ShadowRoot is a subclass of DocumentFragment, so the same
  // test works then too.
  if (element === null || element instanceof DocumentFragment) {
    // Didn't find a scrolling parent.
    return null;
  }
  const style = getComputedStyle(element);
  const overflowX = style.overflowX;
  const overflowY = style.overflowY;
  if (overflowX === 'scroll' || overflowX === 'auto' ||
      overflowY === 'scroll' || overflowY === 'auto') {
    // Found an element we can scroll.
    return element;
  }
  // Keep looking higher in the hierarchy for a scrolling parent.
  return getScrollingParent(element.parentNode);
}


export default defaultScrollTarget;
