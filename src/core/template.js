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
 * an element's template; see [element roles](customizing#element-part-types).
 *
 * @module template
 */

// Used by registerCustomElement.
const mapBaseTagToCount = new Map();

/**
 * Create an element from a role descriptor (a component class constructor or
 * an HTML tag name).
 *
 * If the descriptor is an HTML template, and the resulting document fragment
 * contains a single top-level node, that node is returned directly (instead of
 * the fragment).
 *
 * @param {PartDescriptor} descriptor - the descriptor that will be used to
 * create the element
 * @returns {Element} the new element
 */
export function createElement(descriptor) {
  if (typeof descriptor === "function") {
    // Instantiable component class constructor
    let element;
    try {
      element = new descriptor();
    } catch (/** @type {any} */ e) {
      if (e.name === "TypeError") {
        // Most likely this error results from the fact that the indicated
        // component class hasn't been registered. Register it now with a random
        // name and try again.
        registerCustomElement(descriptor);
        element = new descriptor();
      } else {
        // The exception was for some other reason.
        throw e;
      }
    }
    return element;
    // @ts-ignore
  } else {
    // String tag name: e.g., 'div'
    return document.createElement(descriptor);
  }
}

/**
 * Register the indicated constructor as a custom element class.
 *
 * This function generates a suitable string tag for the class. If the
 * constructor is a named function (which is typical for hand-authored code),
 * the function's `name` will be used as the base for the tag. If the
 * constructor is an anonymous function (which often happens in
 * generated/minified code), the tag base will be "custom-element".
 *
 * In either case, this function adds a uniquifying number to the end of the
 * base to produce a complete tag.
 *
 * @private
 * @param {Constructor<HTMLElement>} classFn
 */
function registerCustomElement(classFn) {
  let baseTag;
  // HTML places more restrictions on the first character in a tag than
  // JavaScript places on the first character of a class name. We apply this
  // more restrictive condition to the class names we'll convert to tags. Class
  // names that fail this check -- often generated class names -- will result in
  // a base tag name of "custom-element".
  const classNameRegex = /^[A-Za-z][A-Za-z0-9_$]*$/;
  const classNameMatch = classFn.name && classFn.name.match(classNameRegex);
  if (classNameMatch) {
    // Given the class name `FooBar`, calculate the base tag name `foo-bar`.
    const className = classNameMatch[0];
    const uppercaseRegEx = /([A-Z])/g;
    const hyphenated = className.replace(
      uppercaseRegEx,
      (match, letter, offset) => (offset > 0 ? `-${letter}` : letter)
    );
    baseTag = hyphenated.toLowerCase();
  } else {
    baseTag = "custom-element";
  }
  // Add a uniquifying number to the end of the tag until we find a tag
  // that hasn't been registered yet.
  let count = mapBaseTagToCount.get(baseTag) || 0;
  let tag;
  for (; ; count++) {
    tag = `${baseTag}-${count}`;
    if (!customElements.get(tag)) {
      // Not in use.
      break;
    }
  }
  // Register with the generated tag.
  customElements.define(tag, /** @type {any} */ classFn);
  // Bump number and remember it. If we see the same base tag again later, we'll
  // start counting at that number in our search for a uniquifying number.
  mapBaseTagToCount.set(baseTag, count + 1);
}

/**
 * Replace an original node in a tree or document fragment with the indicated
 * replacement node. The attributes, classes, styles, and child nodes of the
 * original node will be moved to the replacement.
 *
 * @param {Node} original - an existing node to be replaced
 * @param {Node} replacement - the node to replace the existing node with
 * @returns {Node} the updated replacement node
 */
export function replace(original, replacement) {
  const parent = original.parentNode;
  if (!parent) {
    throw "An element must have a parent before it can be substituted.";
  }
  if (
    (original instanceof HTMLElement || original instanceof SVGElement) &&
    (replacement instanceof HTMLElement || replacement instanceof SVGElement)
  ) {
    // Merge attributes from original to replacement, letting replacement win
    // conflicts. Handle classes and styles separately (below).
    Array.prototype.forEach.call(
      original.attributes,
      (/** @type {Attr} */ attribute) => {
        if (
          !replacement.getAttribute(attribute.name) &&
          attribute.name !== "class" &&
          attribute.name !== "style"
        ) {
          replacement.setAttribute(attribute.name, attribute.value);
        }
      }
    );
    // Copy classes/styles from original to replacement, letting replacement win
    // conflicts.
    Array.prototype.forEach.call(
      original.classList,
      (/** @type {string} */ className) => {
        replacement.classList.add(className);
      }
    );
    Array.prototype.forEach.call(
      original.style,
      (/** @type {number} */ key) => {
        if (!replacement.style[key]) {
          replacement.style[key] = original.style[key];
        }
      }
    );
  }
  // Copy over children.
  // @ts-ignore
  replacement.append(...original.childNodes);

  parent.replaceChild(replacement, original);
  return replacement;
}

/**
 * Replace a node with a new element, transferring all attributes, classes,
 * styles, and child nodes from the original(s) to the replacement(s).
 *
 * The descriptor used for the replacements can be a 1) component class
 * constructor, 2) an HTML tag name, or 3) an HTML template. For #1 and #2, if
 * the existing elements that match the selector are already of the desired
 * class/tag name, the replacement operation is skipped.
 *
 * @param {Element} original - the node to replace
 * @param {PartDescriptor} descriptor - the descriptor used to generate the
 * replacement element
 * @returns {Element} the replacement node(s)
 */
export function transmute(original, descriptor) {
  if (
    (typeof descriptor === "function" && original.constructor === descriptor) ||
    (typeof descriptor === "string" &&
      original instanceof Element &&
      original.localName === descriptor)
  ) {
    // Already correct type of element, no transmutation necessary.
    return original;
  } else {
    // Transmute the single node.
    const replacement = createElement(descriptor);
    replace(original, replacement);
    return replacement;
  }
}
