/**
 * Helpers for getting and setting component attributes and properties using
 * JavaScript dictionary objects.
 * 
 * @module updates
 */

import Symbol from './Symbol.js';


export const mergedProperties = {
  '$': true,
  'attributes': true,
  'classes': true,
  'style': true
};

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

const previousChildNodesKey = Symbol('previousChildNodes');


/**
 * @param {Element} element 
 * @param {object} props
 */
export function apply(element, props) {
  const applyFunctionForProperty = {
    '$': applyReferencedElementProps,
    'attributes': applyAttributes,
    'childNodes': applyChildNodes,
    'classes': applyClasses,
    'style': applyStyle
  };
  for (const key in props) {
    const value = props[key];
    const applyFunction = applyFunctionForProperty[key];
    if (applyFunction) {
      applyFunction(element, value);
    } else {
      // Property with no special apply function; just set the property.
      element[key] = value;
    }
  }
}


/**
 * @param {Element} element 
 * @param {string} name 
 * @param {string|boolean} value 
 */
export function applyAttribute(element, name, value) {
  if (booleanAttributes[name]) {
    // Boolean attribute
    if (value) {
      element.setAttribute(name, '');
    } else {
      element.removeAttribute(name);
    }
  } else {
    // Regular string-valued attribute
    if (value !== null) {
      element.setAttribute(name, value.toString());
    } else {
      element.removeAttribute(name);
    }
  }
}


/**
 * @param {Element} element 
 * @param {any} attributeProps
 */
export function applyAttributes(element, attributeProps) {
  if (attributeProps) {
    for (const attributeName in attributeProps) {
      applyAttribute(element, attributeName, attributeProps[attributeName]);
    }
  }
}


/**
 * @param {Element} element 
 * @param {NodeList|Node[]} childNodes
 */
export function applyChildNodes(element, childNodes) {
  // Quick dirty check if last array applied was frozen.
  if (element[previousChildNodesKey] && childNodes === element[previousChildNodesKey]) {
    return;
  }

  const oldLength = element.childNodes.length;
  const newLength = childNodes.length;
  const length = Math.max(oldLength, newLength);
  for (let i = 0; i < length; i++) {
    const oldChild = element.childNodes[i];
    const newChild = childNodes[i];
    if (i < oldLength && i < newLength && oldChild !== newChild) {
      element.replaceChild(newChild, oldChild);
    } else if (i >= oldLength) {
      element.appendChild(newChild);
    } else if (i >= newLength) {
      element.removeChild(oldChild);
    }
  }

  element[previousChildNodesKey] = Object.isFrozen(childNodes) ?
    childNodes :
    null;
}


/**
 * @param {Element} element 
 * @param {any} classProps
 */
export function applyClasses(element, classProps) {
  for (const className in classProps) {
    const value = classProps[className] || false;
    element.classList.toggle(className, value);
  }
}


function applyReferencedElementProps(element, referencedElementProps) {
  for (const key in referencedElementProps) {
    const props = referencedElementProps[key];
    const referencedElement = element.$[key];
    apply(referencedElement, props);
  }
}


/**
 * @param {HTMLElement|SVGElement} element 
 * @param {any} styleProps
 */
export function applyStyle(element, styleProps) {
  const style = element.style;
  for (const styleName in styleProps) {
    const value = styleProps[styleName];
    style[styleName] = value === undefined ? '' : value;
  }
}


/**
 * @param {Element} element
 * @returns {any}
 */
export function current(element) {
  return element instanceof HTMLElement ?
    {
      attributes: currentAttributes(element),
      classes: currentClasses(element),
      style: currentStyle(element)
    } :
    {
      attributes: currentAttributes(element),
      classes: currentClasses(element),
    };
}


/**
 * @param {Element} element
 * @returns {any}
 */
export function currentAttributes(element) {
  const attributes = {};
  Array.prototype.forEach.call(element.attributes, attribute => {
    // TODO: Convert custom attributes to properties
    if (attribute.name !== 'class' && attribute.name !== 'style') {
      attributes[attribute.name] = attribute.value;
    }
  });
  return attributes;
}


/**
 * @param {Element} element
 * @returns {any}
 */
export function currentClasses(element) {
  const result = {};
  Array.prototype.forEach.call(element.classList, className =>
    result[className] = true
  );
  return result;
}


/**
 * @param {HTMLElement|SVGElement} element
 * @returns {any}
 */
export function currentStyle(element) {
  const styleProps = {};
  Array.prototype.forEach.call(element.style, key => {
    styleProps[key] = element.style[key];
  });
  return styleProps;
}


/**
 * @param {any[]} sources
 * @returns {any}
 */
export function merge(...sources) {
  const result = {};
  sources.forEach(source => {
    if (source) {
      for (const key in source) {
        const value = source[key];
        if (!mergedProperties[key]) {
          // Regular property overwrites existing value.
          result[key] = value;
        } else if (key === '$') {
          // Subelement updates requires deep (recursive) merge.
          result[key] = mergeSubelementUpdates(result[key], value);
        } else if (result[key]) {
          // Other special property requires shallow merge.
          result[key] = Object.assign({}, result[key], value);
        } else {
          // Key doesn't exist on result yet, no need to merge.
          result[key] = value;
        }
      }
    }
  })
  return result;
}


/*
 * Return the merger of two sets of `$` updates for subelements, where each
 * set is like { subelement1: {...updates}, subelement2: {...updates}, ...}.
 * 
 * Given
 * 
 *   { foo: { style: { background: 'black', color: 'gray' }}}
 * 
 * and 
 * 
 *   { foo: { style: { color: 'red' }}}
 * 
 * This returns
 * 
 *   { foo: { style: { background: 'black', color: 'red' }}}
 */
function mergeSubelementUpdates(updates1, updates2) {
  const result = Object.assign({}, updates1);
  for (const element in updates2) {
    result[element] = result[element] ?

      // Merge subelement updates.
      merge(result[element], updates2[element]) :
    
      // Subelement only exists on updates2, so no need to merge.
      updates2[element];
  }
  return result;
}
