/**
 * Mixin which adds simplistic mapping of attributes to properties.
 *
 * @module SimpleAttributeMixin
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function SimpleAttributeMixin(base) {

  /**
   * The class prototype added by the mixin.
   */
  class SimpleAttribute extends base {
    
    /*
     * Handle a change to the attribute with the given name.
     */
    attributeChangedCallback(attributeName, oldValue, newValue) {
  	  if (super.attributeChangedCallback) { super.attributeChangedCallback(); }
  	  // If the attribute name corresponds to a property name, set the property.
  	  // Ignore standard HTMLElement properties handled by the DOM.
  	  if (attributeName in this && !(attributeName in HTMLElement.prototype)) {
          this[attributeName] = newValue;
  	  }
    }

    /**
     * Set/unset the attribute with the indicated name.
     *
     * This method exists primarily to handle the case where an element wants to
     * set a default property value that should be reflected as an attribute. An
     * important limitation of custom element consturctors is that they cannot
     * set attributes. A call to `reflectAttribute` during the constructor will
     * be deferred until the element is connected to the document.
     *
     * @param {string} attribute - The name of the *attribute* (not property) to set.
     * @param {object} value - The value to set. If null, the attribute will be removed.
     */
    reflectAttribute(attribute, value) {
      // For documentation purposes only
    }

  }

  return SimpleAttribute;
}
