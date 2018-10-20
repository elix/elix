/**
 * Helpers for dynamically creating and patching component templates.
 * 
 * The [ShadowTemplateMixin](ShadowTemplateMixin) lets you define a component
 * template that will be used to popuplate the shadow subtree of new component
 * instances. These helpers, especially the [html](#html) function, are intended
 * to simplify the creation of such templates.
 * 
 * In particular, these helpers can be useful in [patching
 * templates](customizing#template-patching) inherited from a base class.
 * 
 * Some of these functions take _descriptors_ that can either be a class, a tag
 * name, or an HTML template. These are generally used to fill specific roles in
 * an element's template; see [element roles](customizing#element-roles).
 * 
 * @module template
 */


import { apply, current, merge } from './updates.js';


/**
 * Create an element from a role descriptor (a component class constructor,
 * an HTML tag name, or an HTML template).
 * 
 * If the descriptor is an HTML template, and the resulting document fragment
 * contains a single top-level node, that node is returned directly (instead of
 * the fragment).
 * 
 * @param {(Function|string|HTMLTemplateElement)} descriptor - the descriptor that
 * will be used to create the element
 * @returns {Node} the new element
 */
export function createElement(descriptor) {
  if (typeof descriptor === 'function') {
    // Component class constructor
    /** @type {any} */
    const cast = descriptor;
    return new cast();
  } else if (descriptor instanceof HTMLTemplateElement) {
    // Template
    const fragment = document.importNode(descriptor.content, true);
    return fragment.children.length === 1 ?
      fragment.children[0] :
      fragment;
  } else {
    // String tag name: e.g., 'div'
    return document.createElement(descriptor);
  }
}


/**
 * Search a tree for a default slot: a slot with no "name" attribute. Return
 * null if not found.
 * 
 * @param {DocumentFragment} tree - the tree to search
 * @returns {Node|null}
 */
export function defaultSlot(tree) {
  return tree.querySelector('slot:not([name])');
}


/**
 * A JavaScript template string literal that returns an HTML template.
 * 
 * Example:
 * 
 *     const myTemplate = html`Hello, <em>world</em>.`
 * 
 * returns an `HTMLTemplateElement` whose `innerHTML` is `Hello, <em>world</em>.`
 * 
 * This function is called `html` so that it can be easily used with HTML
 * syntax-highlighting extensions for various popular code editors.
 * 
 * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
 * literal
 * @param {string[]} substitutions - the variable values passed to the
 * JavaScript template literal
 * @returns {HTMLTemplateElement}
 */
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
 * Replace an original node in a tree or document fragment with the indicated
 * replacement node. The attributes, classes, styles, and child nodes of the
 * original node will be moved to the replacement.
 * 
 * @param {(Node|null)} original - an existing node to be replaced
 * @param {Node} replacement - the node to replace the existing node with
 * @returns {Node} the updated replacement node
 */
export function replace(original, replacement) {
  if (!original) {
    throw 'The original element could not be found.';
  }
  const parent = original.parentNode;
  if (!parent) {
    throw 'An element must have a parent before it can be substituted.'
  }
  if (original instanceof Element && replacement instanceof Element) {
    // Merge replacement attributes/classes/styles on top of original,
    // then apply merged result to the replacement. This lets any
    // attributes/classes/styles directly set on the replacement
    // win any conflicts with the original.
    //
    // We do this application now, before inserting the replacement
    // into the tree, so that RenderUpdatesMixin's record-keeping
    // will consider these values to be original (i.e., equivalent
    // to having been set via markup).
    const merged = merge(current(original), current(replacement));
    apply(replacement, merged);
  }
  // Copy over children.
  original.childNodes.forEach(child => {
    replacement.appendChild(child.cloneNode(true));
  });
  parent.replaceChild(replacement, original);
  return replacement;
}


/**
 * Replace a node or nodes with new element(s), transferring all attributes,
 * classes, styles, and child nodes from the original(s) to the replacement(s).
 * 
 * The descriptor used for the replacements can be a 1) component class
 * constructor, 2) an HTML tag name, or 3) an HTML template. For #1 and #2, if
 * the existing elements that match the selector are already of the desired
 * class/tag name, the replacement operation is skipped.
 * 
 * @param {(Array|NodeList|Node)} original - the node to replace
 * @param {(Function|string|HTMLTemplateElement)} descriptor - the descriptor used
 * to generate replacement elements
 * @returns {Array|Node} the replacement node(s)
 */
export function transmute(original, descriptor) {
  if (original instanceof Array) {
    // Transmute an array.
    const replacements = original.map(node => transmute(node, descriptor));
    return replacements;
  } else if (original instanceof NodeList) {
    // Transmute a list of nodes.
    const replacements = [...original].map(node => transmute(node, descriptor));
    return replacements;
  } else if ((typeof descriptor === 'function' && original.constructor === descriptor) ||
    (typeof descriptor === 'string' && original instanceof Element && 
      original.localName === descriptor)) {
    // Already correct type of element, no transmutation necessary.
    return original;
  } else {
    // Transmute the single node.
    const replacement = createElement(descriptor);
    replace(original, replacement);
    return replacement;
  }
}


/**
 * Destructively wrap a node or document fragment with the indicated wrapper
 * node. The contents of the original node/fragment are moved to the indicated
 * destination node (which should be a node within the wrapper).
 * 
 * @param {Node} original - the node to wrap
 * @param {(DocumentFragment|Element)} wrapper - the node to wrap with
 * @param {string} destination - a CSS selector indicated a node in the wrapper
 * in which the original node should be put
 */
export function wrap(original, wrapper, destination) {
  const destinationNode = wrapper.querySelector(destination);
  if (!destinationNode) {
    throw `Can't find the wrapper destination indicated by "${destination}".`;
  }
  if (original.parentNode) {
    original.parentNode.replaceChild(wrapper, original);
    destinationNode.appendChild(original);
  } else if (original instanceof DocumentFragment) {
    while (original.childNodes.length > 0) {
      destinationNode.appendChild(original.childNodes[0]);
    }
    original.appendChild(wrapper);
  }
}
