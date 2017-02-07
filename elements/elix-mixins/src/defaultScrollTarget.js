/**
 * Return a guess as to what portion of the given element can be scrolled.
 * This can be used to provide a default implementation of
 * [symbols.scrollTarget].
 *
 * If the element has a shadow root containing a default (unnamed) slot, this
 * returns the first ancestor of that slot that is styled with `overflow-y:
 * auto` or `overflow-y: scroll`. If the element has no default slot, or no
 * scrolling ancestor is found, the element itself is returned.
 *
 * @type {HTMLElement}
 */
export default function defaultScrollTarget(element) {
  const slot = element.shadowRoot && element.shadowRoot.querySelector('slot:not([name])');
  return slot ?
    getScrollingParent(slot, element) :
    element;
}


// Return the parent of the given element that can be scroll vertically. If no
// such element is found, return the given root element.
function getScrollingParent(element, root) {
  if (element === null || element === root) {
    // Didn't find a scrolling parent; use the root element instead.
    return root;
  }
  const overflowY = getComputedStyle(element).overflowY;
  if (overflowY === 'scroll' || overflowY === 'auto') {
    // Found an element we can scroll vertically.
    return element;
  }
  // Keep looking higher in the hierarchy for a scrolling parent.
  return getScrollingParent(element.parentNode, root);
}
