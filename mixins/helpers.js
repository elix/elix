const attributeWhiteList = [
  'role',
  'tabindex'
];


export function formatClasses(classProps) {
  const classes = Object.keys(classProps).filter(key => classProps[key]);
  return classes.join(' ');
}


export function formatStyle(styleProps) {
  if (!styleProps) {
    return '';
  }
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join('; ');
}


export function isAttribute(key) {
  return key.match(/-/) || attributeWhiteList.indexOf(key) >= 0;
}


export function mergeDeep(...sources) {
  const output = {};
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        const value = source[key];
        const valueIsObject = typeof value === 'object' && !Array.isArray(value);
        output[key] = valueIsObject && key in output ?
          mergeDeep(output[key], value) :
          value;
      });
    }
  })
  return output;
}


export function currentProps(element) {
  const attributes = [...element.attributes];
  const props = {};
  attributes.forEach(attribute => {
    let key = attribute.name;
    let value;
    switch (attribute.name) {
      case 'class':
        key = 'classes';
        value = parseClasses(element);
        break;

      case 'style':
        value = parseStyle(element);
        break;
      
      default:
        value = attribute.value;
        break;
    }
    props[key] = value;
  });
  return props;
}


export function parseClasses(element) {
  const result = {};
  [...element.classList].forEach(className =>
    result[className] = true
  );
  return result;
}


export function parseStyle(element) {
  const styleProps = {};
  [...element.style].forEach(key => {
    styleProps[key] = element.style[key];
  });
  return styleProps;
}


export function updateProps(element, props) {
  Object.keys(props).forEach(key => {
    const value = props[key];
    switch (key) {
      case 'attributes':
        Object.keys(value).forEach(name => {
          updateAttribute(element, name, value[name]);
        });
        break;
      
      case 'classes':
        if (element.getAttribute('class') !== value) {
          element.setAttribute('class', formatClasses(value));
        }
        break;
      
      case 'style':
        element.style.cssText = '';
        Object.assign(element.style, value);
        break;
      
      default:
        if (isAttribute(key)) {
          updateAttribute(element, key, value);
        } else if (element[key] !== value) {
          // Update property
          element[key] = value;
        }
        break;
    }
  });
}


function updateAttribute(element, name, value) {
  if (element.getAttribute(name) !== value) {
    if (value != null) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  }
}