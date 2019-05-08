/**
 * System for applying batch updates to component attributes and properties
 * 
 * The `Element` prototype exposes several properties that expose a collection
 * that can be modified but not set directly: attributes, childNodes, classList,
 * and (for HTMLElement and SVGElement) style. Although these properties cannot
 * be directly set (you can't write element.attributes = newAttributes), we can
 * define simple and useful write semantics for updating these properties in
 * bulk.
 * 
 * These helpers, especially [apply](#apply), are designed to let components
 * declare a bulk set of updates they would like to apply to themselves or their
 * elements in their shadow trees. Both [RenderUpdatesMixin](RenderUpdatesMixin)
 * and [ContentItemsMixin](ContentItemsMixin) use the same dictionary format
 * supported by `apply`.
 * 
 * @module updates
 */


/**
 * Sets the element's `childNodes` to the given set of nodes.
 * 
 * This adds or removes the element's `childNodes` as necessary to match the
 * nodes indicated in the `childNodes` parameter.
 * 
 * @param {Element} element - the element to update
 * @param {(NodeList|Node[])} childNodes - the set of nodes to apply
 */
export function applyChildNodes(element, childNodes) {
  // If the childNodes parameter is the actual childNodes of an element, then as
  // we append those nodes to the indicated target element, they'll get removed
  // from the original set. To keep the list stable, we make a copy.
  const copy = [...childNodes];

  const oldLength = element.childNodes.length;
  const newLength = copy.length;
  const length = Math.max(oldLength, newLength);
  for (let i = 0; i < length; i++) {
    const oldChild = element.childNodes[i];
    const newChild = copy[i];
    if (i >= oldLength) {
      // Add new item not in old set.
      element.appendChild(newChild);
    } else if (i >= newLength) {
      // Remove old item past end of new set.
      element.removeChild(element.childNodes[newLength]);
    } else if (oldChild !== newChild) {
      if (copy.indexOf(oldChild, i) >= i) {
        // Old node comes later in final set. Insert the new node rather than
        // replacing it so that we don't detach the old node only to have to
        // reattach it later.
        element.insertBefore(newChild, oldChild);
      } else {
        // Replace old item with new item.
        element.replaceChild(newChild, oldChild);
      }
    }
  }
}
