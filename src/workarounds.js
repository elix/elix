/**
 * Helper functions to work around problems in specific browsers.
 * 
 * @module workarounds
 */

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
