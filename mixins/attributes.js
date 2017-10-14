/**
 * These are helper functions for accessing a component's attributes.
 *
 * @module attributes
 */


/**
 * Immediately toggle the indicated class.
 * 
 * This method exists only to support IE 11, whose `classList.toggle`
 * implementation is deficient.
 *
 * @param {Element} element - The element to modify.
 * @param {string} className - The name of the class to set/unset.
 * @param {boolean} [value] - True to set the class, false to remove it. If
 * omitted, the class will be toggled.
 */
export function toggleClass(element, className, value) {
  const classList = element.classList;
  const addClass = typeof value === 'undefined' ?
    !classList.contains(className) :
    value;
  if (addClass) {
    classList.add(className);
  } else {
    classList.remove(className);
  }
  return addClass;
}
