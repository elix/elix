/**
 * Returns true if the first node contains (or is) the second, even if the
 * second node is in a shadow tree.
 *
 * The standard Node.contains() function does not account for Shadow DOM, and
 * returns false if the supplied target node is sitting inside a shadow tree
 * within the container.
 * 
 * @param {Node} container - The container to search within.
 * @param {Node} target - The node that may be inside the container.
 * @returns {boolean} - True if the container contains the target node.
 */
export default function deepContains(container, target) {
  /** @type {any} */
  let current = target;
  while (current) {
    if (container === current) {
      return true;
    }
    current = current.parentNode || current.host;
  }
  return false;
}
