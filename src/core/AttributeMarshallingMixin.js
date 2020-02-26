import * as internal from "./internal.js";

/** @type {IndexedObject<boolean>} */
export const booleanAttributes = {
  checked: true,
  defer: true,
  disabled: true,
  hidden: true,
  ismap: true,
  multiple: true,
  noresize: true,
  readonly: true,
  selected: true
};

// Memoized maps of attribute to property names and vice versa.
// We initialize this with the special case of the tabindex (lowercase "i")
// attribute, which is mapped to the tabIndex (capital "I") property.
/** @type {IndexedObject<string>} */
const attributeToPropertyNames = {
  tabindex: "tabIndex"
};
/** @type {IndexedObject<string>} */
const propertyNamesToAttributes = {
  tabIndex: "tabindex"
};

/**
 * Sets properties when corresponding attributes change.
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
 * @module AttributeMarshallingMixin
 * @param {Constructor<CustomElement>} Base
 */
export default function AttributeMarshallingMixin(Base) {
  // The class prototype added by the mixin.
  class AttributeMarshalling extends Base {
    /**
     * Handle a change to the attribute with the given name.
     *
     * @ignore
     * @param {string} attributeName
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(attributeName, oldValue, newValue);
      }
      // Sometimes there's not actually any change.
      // We also skip setting properties if we're rendering. A component
      // may want to reflect property values to attributes during rendering,
      // but such attribute changes shouldn't trigger property updates.
      if (newValue !== oldValue && !this[internal.rendering]) {
        const propertyName = attributeToPropertyName(attributeName);
        // If the attribute name corresponds to a property name, set the property.
        if (propertyName in this) {
          this[propertyName] = castPotentialBooleanAttribute(
            attributeName,
            newValue
          );
        }
      }
    }

    // Because maintaining the mapping of attributes to properties is tedious,
    // this provides a default implementation for `observedAttributes` that
    // assumes that your component will want to expose all public properties in
    // your component's API as properties.
    //
    // You can override this default implementation of `observedAttributes`. For
    // example, if you have a system that can statically analyze which
    // properties are available to your component, you could hand-author or
    // programmatically generate a definition for `observedAttributes` that
    // avoids the minor run-time performance cost of determining your
    // component's public properties.
    static get observedAttributes() {
      return attributesForClass(this);
    }
  }

  return AttributeMarshalling;
}

/**
 * Return the custom attributes for the given class.
 *
 * @private
 * @param {Constructor<HTMLElement>} classFn
 */
function attributesForClass(classFn) {
  // We treat the HTMLElement base class as if it has no attributes, since we
  // don't want to receive attributeChangedCallback for it.
  if (classFn === HTMLElement) {
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
  const setterNames = propertyNames.filter(propertyName => {
    const descriptor = Object.getOwnPropertyDescriptor(
      classFn.prototype,
      propertyName
    );
    return descriptor && typeof descriptor.set === "function";
  });
  const attributes = setterNames.map(setterName =>
    propertyNameToAttribute(setterName)
  );

  // Merge.
  const diff = attributes.filter(
    attribute => baseAttributes.indexOf(attribute) < 0
  );
  const result = baseAttributes.concat(diff);

  return result;
}

/**
 * Convert hyphenated foo-bar attribute name to camel case fooBar property name.
 *
 * @private
 * @param {string} attributeName
 */
function attributeToPropertyName(attributeName) {
  let propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    const hyphenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hyphenRegEx, match =>
      match[1].toUpperCase()
    );
    attributeToPropertyNames[attributeName] = propertyName;
  }
  return propertyName;
}

/**
 * If the given attribute name corresponds to a boolean attribute, map the
 * supplied string value to a boolean. Otherwise return as is.
 *
 * @private
 * @param {string} attributeName
 * @param {string} value
 */
function castPotentialBooleanAttribute(attributeName, value) {
  if (booleanAttributes[attributeName]) {
    if (typeof value === "string") {
      return true;
    } else if (value === null) {
      return false;
    }
  }
  return value;
}

/**
 * Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
 *
 * @private
 * @param {string} propertyName
 */
function propertyNameToAttribute(propertyName) {
  let attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    const uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, "-$1").toLowerCase();
    propertyNamesToAttributes[propertyName] = attribute;
  }
  return attribute;
}
