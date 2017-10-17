import Symbol from './Symbol.js';


const previousChildNodesKey = Symbol('previousChildNodes');


export function apply(element, props) {
  Object.keys(props).forEach(key => {
    const value = props[key];
    switch (key) {
      case 'attributes':
        applyAttributes(element, value);
        break;

      case 'classes':
        applyClasses(element, value);
        break;

      case 'style':
        applyStyle(element, value);
        break;

      default:
        // Update property
        element[key] = value;
        break;
    }
  });
}


export function applyAttribute(element, name, value) {
  if (element.getAttribute(name) !== value) {
    if (value !== null) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  }
}


export function applyAttributes(element, attributeProps) {
  if (attributeProps) {
    Object.keys(attributeProps).forEach(name => {
      applyAttribute(element, name, attributeProps[name]);
    });
  }
}


export function applyChildNodes(element, childNodes) {
  // Quick dirty check if last array applied was frozen.
  if (element[previousChildNodesKey] && childNodes === element[previousChildNodesKey]) {
    return;
  }

  const oldLength = element.childNodes.length;
  const newLength = childNodes.length;
  const length = Math.max(oldLength, newLength);
  for (let i = 0; i < length; i++) {
    if (i < oldLength && i < newLength && element.childNodes[i] !== childNodes[i]) {
      element.replaceChild(element.childNodes[i], childNodes[i]);
    } else if (i >= oldLength) {
      element.appendChild(childNodes[i]);
    } else if (i >= newLength) {
      element.removeChild(element.childNodes[i]);
    }
  }

  element[previousChildNodesKey] = Object.isFrozen(childNodes) ?
    childNodes :
    null;
}


export function applyClasses(element, classProps) {
  applyAttribute(element, 'class', formatClassProps(classProps));
}


export function applyStyle(element, styleProps) {
  Object.assign(element.style, styleProps);
}


export function formatClassProps(classProps) {
  if (!classProps) {
    return '';
  }
  const classes = Object.keys(classProps).filter(key => classProps[key]);
  return classes.join(' ');
}


export function formatStyleProps(styleProps) {
  if (!styleProps) {
    return '';
  }
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join('; ');
}


export function get(element) {
  return {
    attributes: getAttributes(element),
    classes: getClasses(element),
    style: getStyle(element)
  };
}


export function getAttributes(element) {
  const attributes = {};
  [...element.attributes].forEach(attribute => {
      // TODO: Convert custom attributes to properties
      if (attribute.name !== 'class' && attribute.name !== 'style') {
          attributes[attribute.name] = attribute.value;
      }
  });
  return attributes;
}


export function getClasses(element) {
  const result = {};
  [...element.classList].forEach(className =>
    result[className] = true
  );
  return result;
}


export function getStyle(element) {
  const styleProps = {};
  [...element.style].forEach(key => {
    styleProps[key] = element.style[key];
  });
  return styleProps;
}


export function merge(...sources) {
  const specialProps = {
    'attributes': true,
    'classes': true,
    'style': true
  };
  const output = {};
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        const value = source[key];
        output[key] = specialProps[key] >= 0 ?
          Object.assign(output[key] || {}, value) :
          value;
      });
    }
  })
  return output;
}
