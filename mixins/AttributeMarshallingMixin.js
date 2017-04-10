import * as attributes from './attributes';


// Memoized maps of attribute to property names and vice versa.
const attributeToPropertyNames = {};
const propertyNamesToAttributes = {};


/**
 * Mixin which marshalls attributes to properties and vice versa.
 *
 * If your component exposes a setter for a property, it's generally a good
 * idea to let devs using your component be able to set that property in HTML
 * via an element attribute. You can code that yourself by writing an
 * `attributeChangedCallback`, or you can use this mixin to get a degree of
 * automatic support.
 *
 * This mixin implements an `attributeChangedCallback` that will attempt to
 * convert a change in an element attribute into a call to the corresponding
 * property setter. Attributes typically follow hyphenated names ("foo-bar"),
 * whereas properties typically use camelCase names ("fooBar"). This mixin
 * respects that convention, automatically mapping the hyphenated attribute
 * name to the corresponding camelCase property name.
 *
 * Example: You define a component using this mixin:
 *
 *     class MyElement extends AttributeMarshallingMixin(HTMLElement) {
 *       get fooBar() { return this._fooBar; }
 *       set fooBar(value) { this._fooBar = value; }
 *     }
 *     customElements.define('my-element', MyElement);
 *
 * If someone then instantiates your component in HTML:
 *
 *     <my-element foo-bar="Hello"></my-element>
 *
 * Then, after the element has been upgraded, the `fooBar` setter will
 * automatically be invoked with the initial value "Hello".
 *
 * Attributes can only have string values. If you'd like to convert string
 * attributes to other types (numbers, booleans), you must implement parsing
 * yourself.
 *
 * This mixin also exposes helpers for reflecting attributes and classes to
 * the element. These helpers can be invoked during a component's constructor;
 * any attributes or classes set during the constructor are applied when the
 * component's `connectedCallback` is invoked.
 *
 * @module AttributeMarshallingMixin
 * @param base {Class} - The base class to extend
 * @returns {Class} The extended class
 */
export default function AttributeMarshallingMixin(base) {

  // The class prototype added by the mixin.
  class AttributeMarshalling extends base {

    /*
     * Handle a change to the attribute with the given name.
     */
    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (super.attributeChangedCallback) { super.attributeChangedCallback(); }
      const propertyName = attributeToPropertyName(attributeName);
      // If the attribute name corresponds to a property name, set the property.
      if (propertyName in this) {
        this[propertyName] = newValue;
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // Reflect any attributes set during constructor.
      attributes.writePendingAttributes(this);
    }

    static get observedAttributes() {
      return attributesForClass(this);
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
      return attributes.setAttribute(this, attribute, value);
    }

    /**
     * Set/unset the class with the indicated name.
     *
     * This method exists primarily to handle the case where an element wants to
     * set a default property value that should be reflected as as class. An
     * important limitation of custom element consturctors is that they cannot
     * set attributes, including the `class` attribute. A call to
     * `reflectClass` during the constructor will be deferred until the element
     * is connected to the document.
     *
     * @param {string} className - The name of the class to set.
     * @param {object} value - True to set the class, false to remove it.
     */
    reflectClass(className, value) {
      return attributes.toggleClass(this, className, value);
    }

  }

  return AttributeMarshalling;
}


// Return the custom attributes for the given class.
function attributesForClass(classFn) {

  // We treat the HTMLElement base class as if it has no attributes, since we
  // don't want to receive attributeChangedCallback for it. We'd like to do
  // a simple check if classFn === HTMLElement, but this fails in the polyfill
  // under IE, so we compare prototypes instead.
  if (classFn.prototype === HTMLElement.prototype) {
    return [];
  }

  // Get attributes for parent class.
  const baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
  // See if parent class defines observedAttributes manually.
  let baseAttributes = baseClass.observedAttributes;
  if (!baseAttributes) {
    // Calculate parent class attributes ourselves.
    baseAttributes = attributesForClass(baseClass);
  }

  // Get attributes for this class.
  const propertyNames = Object.getOwnPropertyNames(classFn.prototype);
  const setterNames = propertyNames.filter(propertyName =>
    typeof Object.getOwnPropertyDescriptor(
        classFn.prototype, propertyName).set === 'function');
  const attributes = setterNames.map(setterName =>
      propertyNameToAttribute(setterName));

  // Merge.
  const diff = attributes.filter(attribute =>
      baseAttributes.indexOf(attribute) < 0);
  return baseAttributes.concat(diff);
}

// Convert hyphenated foo-bar attribute name to camel case fooBar property name.
function attributeToPropertyName(attributeName) {
  let propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    const hyphenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hyphenRegEx,
        match => match[1].toUpperCase());
    attributeToPropertyNames[attributeName] = propertyName;
  }
  return propertyName;
}

// Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
function propertyNameToAttribute(propertyName) {
  let attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    const uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, '-$1').toLowerCase();
  }
  return attribute;
}
