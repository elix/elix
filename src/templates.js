export function elementFromDescriptor(descriptor) {
  if (typeof descriptor === 'function') {
    return new descriptor();
  } else if (descriptor instanceof HTMLElement) {
    return descriptor.cloneNode(true);
  } else {
    return document.createElement(descriptor);
  }
}


export function substituteElement(original, replacement) {
  const element = replacement instanceof HTMLTemplateElement ?
    replacement.content.cloneNode(true) :
    replacement;
  original.parentNode.replaceChild(element, original);
  // Copy over attributes which are not already present on replacement.
  for (const { name, value } of original.attributes) {
    if (!element.getAttribute(name)) {
      element.setAttribute(name, value);
    }
  }
  // Copy over children.
  original.childNodes.forEach(child => {
    element.appendChild(child.cloneNode(true));
  });
}


export function html(strings, ...substitutions) {
  // Concatenate the strings and substitutions.
  const complete = strings.map((string, index) => {
    const substitution = substitutions[index] || '';
    return `${string}${substitution}`;
  }).join('');
  const template = document.createElement('template');
  template.innerHTML = complete;
  return template;
}
