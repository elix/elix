/**
 * Helpers for getting and setting component attributes and properties using
 * JavaScript dictionary objects.
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
  for (const key in props) {
    const value = props[key];
    switch (key) {

      case '$':
        applyReferencedElementProps(element, value);
        break;

      case 'attributes':
        applyAttributes(element, value);
        break;

      case 'childNodes':
        applyChildNodes(element, value);
        break;

      case 'classes':
        applyClasses(element, value);
        break;

      case 'style':
        if (element instanceof HTMLElement || element instanceof SVGElement) {
          applyStyle(element, value);
        }
        break;

      default:
        // Update property
        element[key] = value;
        break;
    }
  }
}


/**
 * @param {Element} element 
 * @param {string} name 
 * @param {string|boolean|null} value 
 */
export function applyAttribute(element, name, value) {
  const existingValue = element.getAttribute(name);
  if (booleanAttributes[name]) {
    // Boolean attribute
    const changed = (existingValue === null) === value;
    if (changed) {
      if (value) {
        element.setAttribute(name, '');
      } else {   
        element.removeAttribute(name);
      }
    }
  } else if (existingValue !== value) {
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
 * @param {string} className
 * @param {boolean} value
 */
export function applyClass(element, className, value) {
  if (value) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}


/**
 * @param {Element} element 
 * @param {any} classProps
 */
export function applyClasses(element, classProps) {
  for (const className in classProps) {
    applyClass(element, className, classProps[className])
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
 * @param {any} classProps
 * @returns string
 */
export function formatClassProps(classProps) {
  if (!classProps) {
    return '';
  }
  const classes = Object.keys(classProps).filter(key => classProps[key]);
  return classes.join(' ');
}


/**
 * @param {any} styleProps
 * @returns string
 */
export function formatStyleProps(styleProps) {
  if (!styleProps) {
    return '';
  }
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join('; ');
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
        result[key] = !mergedProperties[key] ?
          // Regular property overwrites existing value.
          result[key] = value :
          key === '$' ?
            // Element subproperty requires deep (recursive) merge.
            merge(result[key], value) :
            // Other special property requires shallow merge.
            Object.assign(result[key] || {}, value);
      }
    }
  })
  return result;
}
