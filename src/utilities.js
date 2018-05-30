/**
 * Component utilities
 * 
 * @module utilities
 */


 /**
 * Returns true if the first node contains the second, even if the second node
 * is in a shadow tree.
 *
 * The standard Node.contains() function does not account for Shadow DOM, and
 * returns false if the supplied target node is sitting inside a shadow tree
 * within the container.
 * 
 * @param {Node} container - The container to search within.
 * @param {Node} target - The node that may be inside the container.
 * @returns {boolean} - True if the container contains the target node.
 */
export function deepContains(container, target) {
  /** @type {any} */
  let current = target;
  while (current) {
    const parent = current.assignedSlot || current.parentNode || current.host;
    if (parent === container) {
      return true;
    }
    current = parent;
  }
  return false;
}


/**
 * Return the index of the list child that is, or contains, the indicated target
 * node. Return -1 if not found.
 */
export function indexOfItemContainingTarget(element, target) {
  const items = element.items || [];
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if (item === target || deepContains(item, target)) {
      return index;
    }
  }
  return -1;
}
