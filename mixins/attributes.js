//
// Copyright © 2016-2017 Component Kitchen, Inc. and contributors to the 
// Elix Project
//

/**
 * These are helper functions for accessing a component's attributes.
 *
 * @module attributes
 */


import Symbol from './Symbol';


// Symbols for private data members on an element.
const safeToSetAttributesSymbol = Symbol('safeToSetAttributes');
const pendingAttributesSymbol = Symbol('pendingAttributes');
const pendingClassesSymbol = Symbol('pendingClasses');


/**
 * Set/unset the attribute with the indicated name.
 *
 * This method exists primarily to handle the case where an element wants to
 * set a default property value that should be reflected as an attribute. An
 * important limitation of custom element consturctors is that they cannot
 * set attributes. A call to `setAttribute` during the constructor will
 * be deferred until the element is connected to the document.
 *
 * @param {string} attribute - The name of the *attribute* (not property) to set.
 * @param {object} value - The value to set. If null, the attribute will be removed.
 */
export function setAttribute(element, attribute, value) {
  if (element[safeToSetAttributesSymbol]) {
    // Safe to set attributes immediately.
    setAttributeToElement(element, attribute, value);
  } else {
    // Defer setting attributes until the first time we're connected.
    if (!element[pendingAttributesSymbol]) {
      element[pendingAttributesSymbol] = {};
    }
    element[pendingAttributesSymbol][attribute] = value;
  }
}

/**
 * Set/unset the class with the indicated name.
 *
 * This method exists primarily to handle the case where an element wants to
 * set a default property value that should be reflected as as class. An
 * important limitation of custom element consturctors is that they cannot
 * set attributes, including the `class` attribute. A call to
 * `toggleClass` during the constructor will be deferred until the element
 * is connected to the document.
 *
 * @param {string} className - The name of the class to set.
 * @param {boolean} [value] - True to set the class, false to remove it. If
 * omitted, the class will be toggled.
 */
export function toggleClass(element, className, value) {
  if (element[safeToSetAttributesSymbol]) {
    // Safe to set class immediately.
    // Since IE 11's native `toggleClass` implementation is deficient, we
    // set or unset the class by hand.
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
  } else {
    // Defer setting class until the first time we're connected.
    if (!element[pendingClassesSymbol]) {
      element[pendingClassesSymbol] = {};
    }
    element[pendingClassesSymbol][className] = value;
  }
}

/**
 * Perform any pending updates to attributes and classes.
 *
 * This writes any `setAttribute` or `toggleClass` values that were performed
 * before an element was attached to the document for the first time.
 *
 * This method should be called by mixins/components in their
 * `connectedCallback`. If mulitple mixins/components invoke this during the
 * same `connectedCallback`, only the first call will have any effect. The
 * subsequent calls will be harmless.
 *
 * @param {HTMLElement} element - The element being added to the document.
 */
export function writePendingAttributes(element) {
  element[safeToSetAttributesSymbol] = true;

  // Set any pending attributes.
  const pendingAttributes = element[pendingAttributesSymbol];
  if (pendingAttributes) {
    for (let attribute in pendingAttributes) {
      const value = pendingAttributes[attribute];
      setAttributeToElement(element, attribute, value);
    }
    element[pendingAttributesSymbol] = null;
  }

  // Set any pending classes.
  const pendingClasses = element[pendingClassesSymbol];
  if (pendingClasses) {
    for (let className in pendingClasses) {
      const value = pendingClasses[className];
      toggleClass(element, className, value);
    }
    element[pendingClassesSymbol] = null;
  }
}


//
// Helpers
//

// Reflect the attribute to the given element.
// If the value is null, remove the attribute.
function setAttributeToElement(element, attributeName, value) {
  if (value === null || typeof value === 'undefined') {
    element.removeAttribute(attributeName);
  } else {
    const text = String(value);
    // Avoid recursive attributeChangedCallback calls.
    if (element.getAttribute(attributeName) !== text) {
      element.setAttribute(attributeName, value);
    }
  }
}
