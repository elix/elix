/**
 * Helper functions to work around problems in specific browsers.
 * 
 * @module workarounds
 */


const mousedownListenerKey = Symbol('mousedownListener');


/**
 * 
 * @param {HTMLElement} origin
 * @param {HTMLElement} target
 */
export function forwardFocus(origin, target) {
  if (origin[mousedownListenerKey]) {
    // Origin was previously forwarding focus, probably to a different target.
    // Remove the previous event listener.
    origin.removeEventListener('mousedown', origin[mousedownListenerKey]);
  }
  if (target) {
    // Using forward focus implies no tab stop.
    origin.setAttribute('tabindex', '-1');
    origin[mousedownListenerKey] = (event) => {
      // Only process events for the main (usually left) button.
      if (event.button !== 0) {
        return;
      }
      target.focus();
      event.preventDefault();
    };
    origin.addEventListener('mousedown', origin[mousedownListenerKey]);
  }
}


//
// Return the closest focusable ancestor in the *composed* tree.
//
// The default behavior for mousedown should set the focus to the closest
// ancestor of the clicked element that can take the focus. As of Nov 2018,
// Chrome and Safari don't handle this as expected when the clicked element is
// reassigned across more than one slot to end up inside a focusable element. In
// such cases, the focus will end up on the body. See
// https://github.com/w3c/webcomponents/issues/773.
//
// As a workaround, we walk up the composed tree to find the first element that
// can take the focus and put the focus on it.
//
function findFocusableAncestor(element) {
  if (element === document.body ||
    (!(element instanceof HTMLSlotElement) && element.tabIndex >= 0)) {
    return element;
  }
  // @ts-ignore
  const parent = element.assignedSlot ?
    element.assignedSlot :
    element.parentNode instanceof ShadowRoot ?
      element.parentNode.host :
      element.parentNode;
  return parent ?
    findFocusableAncestor(parent) :
    null;
}


// Walk up the class hierarch looking for a getter for the indicated property.
function findPropertyGetter(prototype, property) {
  let current = prototype;
  while (current) {
    const descriptor = Object.getOwnPropertyDescriptor(current, property);
    if (descriptor && descriptor.get) {
      return descriptor.get;
    }
    current = Object.getPrototypeOf(current);
  }
  return undefined;
}


/**
 * Return the superclass' value of a symbol-indexed property.
 * 
 * Edge 18 contains a nasty bug in which a symbol-indexed property implementation
 * cannot correctly obtain a base class value by calling `super`.
 * See https://github.com/Microsoft/ChakraCore/issues/4835. Specifically, the
 * value of `this` will be incorrect inside the invoked superclass property.
 * 
 * E.g., the following will fail in Edge 18:
 * 
 *     class Carousel extends Explorer {
 *       get [symbols.template]() {
 *         const base = super[symbols.template]; // This fails
 *         return base;
 *       }
 *     }
 * 
 * This function manually performs an equivalent `super` call to workaround the
 * problem. It can be used in place of the `super` call above:
 * 
 *     class Carousel extends Explorer {
 *       get [symbols.template]() {
 *         const base = getSuperProperty(this, Carousel, symbols.template);
 *         return base;
 *       }
 *     }
 * 
 * The `Carousel` parameter in the call above must be the same class as the one
 * defining the property. This *cannot* be replaced with `this.constructor`, as
 * that would fail if the property were invoked from a subclass.
 * 
 * If/when the Edge bug is fixed, calls to this function can be replaced with
 * a plain `super` call.
 * 
 * @param {Object} obj - the object with the property to retrieve
 * @param {Object} cls - the starting point in the class hierarchy
 * @param {(string|Symbol)} property - identifier for the desired property
 */
export function getSuperProperty(obj, cls, property) {
  const superProto = Object.getPrototypeOf(cls.prototype);
  const getter = findPropertyGetter(superProto, property);
  if (getter) {
    return getter.call(obj);
  }
}