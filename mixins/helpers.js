const attributeWhiteList = [
  'class',
  'role',
];


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
    const value = attribute.name === 'style' ?
      parseStyle(element) :
      attribute.value
    props[attribute.name] = value;
  });
  return props;
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
    if (key === 'style') {
      element.style.cssText = '';
      Object.assign(element.style, value);
    } else if (isAttribute(key) && element.getAttribute(key) !== value) {
      // Update attribute
      if (value != null) {
        element.setAttribute(key, value);
      } else {
        element.removeAttribute(key);
      }
    } else if (element[key] !== value) {
      // Update property
      element[key] = value;
    }
  });
}
