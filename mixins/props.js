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


export function applyProps(element, props) {
  Object.keys(props).forEach(key => {
    const value = props[key];
    switch (key) {
      case 'attributes':
        applyAttributeProps(element, value);
        break;
      
      case 'classes':
        applyClassProps(element, value);
        break;
      
      case 'style':
        applyStyleProps(element, value);
        break;
      
      default:
        // Update property
        element[key] = value;
        break;
    }
  });
}


function applyAttributeProps(element, attributeProps) {
  if (attributeProps) {
    Object.keys(attributeProps).forEach(name => {
      applyAttribute(element, name, attributeProps[name]);
    });
  }
}


function applyClassProps(element, classProps) {
  applyAttribute(element, 'class', formatClassProps(classProps));
}


function applyStyleProps(element, styleProps) {
  element.style.cssText = '';
  Object.assign(element.style, styleProps);
}


function applyAttribute(element, name, value) {
  if (element.getAttribute(name) !== value) {
    if (value !== null) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  }
}


export function getProps(element) {

  const attributes = {};
  [...element.attributes].forEach(attribute => {
    // TODO: Convert custom attributes to properties
    if (attribute.name !== 'class' && attribute.name !== 'style') {
      attributes[attribute.name] = attribute.value;
    }
  });
  const classes = getClassProps(element);
  const style = getStyleProps(element);

  const props = {
    attributes,
    classes,
    style
  };

  return props;
}


function getClassProps(element) {
  const result = {};
  [...element.classList].forEach(className =>
    result[className] = true
  );
  return result;
}


function getStyleProps(element) {
  const styleProps = {};
  [...element.style].forEach(key => {
    styleProps[key] = element.style[key];
  });
  return styleProps;
}


export function mergeProps(...sources) {
  const specialProps = [
    'attributes',
    'classes',
    'style'
  ];
  const output = {};
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        const value = source[key];
        output[key] = specialProps.indexOf(key) >= 0 ?
          Object.assign(output[key] || {}, value) :
          value;
      });
    }
  })
  return output;
}
