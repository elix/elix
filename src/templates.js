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
  original.parentNode.replaceChild(replacement, original);
  // Copy over attributes which are not already present on replacement.
  for (const { name, value } of original.attributes) {
    if (!replacement.getAttribute(name)) {
      replacement.setAttribute(name, value);
    }
  }
  // Copy over children.
  original.childNodes.forEach(child => {
    replacement.appendChild(child.cloneNode(true));
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
