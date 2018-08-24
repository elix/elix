/**
 * 
 * @param {Function|string|HTMLTemplateElement} role 
 */
export function createElement(role) {
  if (typeof role === 'function') {
    // Component class constructor
    /** @type {any} */
    const cast = role;
    return new cast();
  } else if (role instanceof HTMLTemplateElement) {
    // Template
    return document.importNode(role.content, true);
  } else {
    // String tag name: e.g., 'div'
    return document.createElement(role);
  }
}


export function fillRole(template, selector, role) {
  const node = template instanceof HTMLTemplateElement ?
    template.content :
    template;
  node.querySelectorAll(selector).forEach(match => {
    if ((typeof role === 'function' && node.constructor === role) ||
    (typeof role === 'string' && node.localName === role)) {
      // Already correct type of element
      return;
    }
    replace(match, createElement(role));
  });
}


export function html(strings, ...substitutions) {
  // Concatenate the strings and substitutions.
  const complete = strings.map((string, index) => {
    const substitution = index < substitutions.length ?
      substitutions[index] :
      '';
    return `${string}${substitution}`;
  }).join('');
  const template = document.createElement('template');
  template.innerHTML = complete;
  return template;
}


/**
 * 
 * @param {Node|null} original 
 * @param {Node} replacement 
 */
export function replace(original, replacement) {
  if (!original) {
    throw 'The original element could not be found.';
  }
  if (!original.parentNode) {
    throw 'An element must have a parent before it can be substituted.'
  }
  const element = replacement instanceof HTMLTemplateElement ?
    replacement.content.cloneNode(true) :
    replacement;
  original.parentNode.replaceChild(element, original);
  if (original instanceof Element && element instanceof Element) {
    // Copy over attributes which are not already present on replacement.
    const attributes = Array.from(original.attributes); // For Edge
    for (const { name, value } of attributes) {
      if (!element.getAttribute(name)) {
        element.setAttribute(name, value);
      }
    }
  }
  // Copy over children.
  original.childNodes.forEach(child => {
    element.appendChild(child.cloneNode(true));
  });
}


/**
 * @param original {Node} - the node to wrap
 * @param wrapper {Node} - the node to wrap with
 * @param destination {Node} - the node in the wrapper in which the original
 * node should be put
 */
export function wrap(original, wrapper, destination) {
  if (original.parentNode) {
    original.parentNode.replaceChild(wrapper, original);
    destination.appendChild(original);
  } else if (original instanceof DocumentFragment) {
    while (original.childNodes.length > 0) {
      destination.appendChild(original.childNodes[0]);
    }
    original.appendChild(wrapper);
  }
}
