/**
 * System for applying batch updates to component attributes and properties
 * 
 * The `Element` prototype exposes several properties that expose a collection
 * that can be modified but not set directly: attributes, childNodes, classList,
 * and (for HTMLElement and SVGElement) style. Although these properties cannot
 * be directly set (you can't write element.attributes = newAttributes), we can
 * define simple and useful write semantics for updating these properties in
 * bulk.
 * 
 * These helpers, especially [apply](#apply), are designed to let components
 * declare a bulk set of updates they would like to apply to themselves or their
 * elements in their shadow trees. Both [RenderUpdatesMixin](RenderUpdatesMixin)
 * and [ContentItemsMixin](ContentItemsMixin) use the same dictionary format
 * supported by `apply`.
 * 
 * @module updates
 */


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
 * Apply bulk updates to an element's attributes, child nodes, classes, styles,
 * and shadow elements.
 * 
 * This takes an `updates` dictionary. Certain keys of this dictionary are
 * handled specially:
 * 
 * * `attributes`: invokes [applyAttributes](#applyAttributes)
 * * `childNodes`: invokes [applyChildNodes](#applyChildNodes)
 * * `classes`: invokes [applyClasses](#applyClasses)
 * * `style`: invokes [applyStyles](#applyStyles)
 * * `$`: applies updates to referenced elements in the component's shadow tree.
 *   (See below.)
 * 
 * All other `name: value` entries are interpreted as custom properties.
 * 
 * Example:
 * 
 *     import * as updates from 'elix/src/updates.js';
 * 
 *     const div = document.createElement('div');
 *     div.classList.add('foo bar');
 *     updates.apply({
 *       classList: {
 *         bar: false, // Removes bar
 *         baz: true   // Adds baz
 *       }
 *     });
 *     div.classList.value // "foo baz"
 * 
 * Note that `apply` _updates_ the indicated properties, leaving in place any
 * other existing element attributes, classes, or styles not specifically
 * referenced in the dictionary (e.g., the class "foo" above).
 * 
 * As noted above, `apply` can be used to set custom element properties. E.g.,
 * 
 *     updates.apply(element, { foo: 'bar' });
 * 
 * is equivalent to calling:
 * 
 *     element.foo = 'bar';
 * 
 * @param {Element} element - the element to update
 * @param {object} updates - the updates to apply
 */
export function apply(element, updates) {
  const applyFunctionForProperty = {
    '$': applyReferencedElementUpdates,
    'attributes': applyAttributes,
    'childNodes': applyChildNodes,
    'classes': applyClasses,
    'style': applyStyles
  };
  for (const key in updates) {
    const value = updates[key];
    const applyFunction = applyFunctionForProperty[key];
    if (applyFunction) {
      applyFunction(element, value);
    } else {
      // Property with no special apply function; just set the property.
      applyProperty(element, key, value);
    }
  }
}


/**
 * Update the given attribute on an element.
 * 
 * Passing a non-null `value` acts like a call to `setAttribute(name, value)`.
 * If the supplied `value` is nullish, this acts like a call to
 * `removeAttribute(name)`.
 * 
 * Boolean attributes are treated specially. If the attribute `name` matches one
 * of the known HTML boolean attributes (`checked`, `defer`, `disabled`,
 * `hidden`, `ismap`, `multiple`, `noresize`, `readonly`, `selected`), the
 * attribute will be handled as a boolean attribute. A truthy `value` acts like
 * a call to `setAttribute(name, '')`. A falsy value acts like
 * `removeAttribute(name)`.
 * 
 * @param {Element} element - the element to update
 * @param {string} name - the attribute name
 * @param {(string|boolean)} value - the attribute value to set
 */
export function applyAttribute(element, name, value) {
  if (booleanAttributes[name]) {
    // Boolean attribute
    if (value) {
      element.setAttribute(name, '');
    } else {
      element.removeAttribute(name);
    }
  } else {
    // Regular string-valued attribute
    if (value != null) {
      element.setAttribute(name, value.toString());
    } else {
      element.removeAttribute(name);
    }
  }
}


/**
 * Apply the indicated attributes to the element.
 * 
 * This takes a dictionary in which each `name: value` is results in a call to
 * `applyAttribute(name, value)`. See [applyAttribute](#applyAttribute) for
 * details.
 * 
 * @param {Element} element - the element to update
 * @param {object} attributes - a dictionary of attributes to apply
 */
export function applyAttributes(element, attributes) {
  if (attributes) {
    for (const attributeName in attributes) {
      applyAttribute(element, attributeName, attributes[attributeName]);
    }
  }
}


/**
 * Sets the element's `childNodes` to the given set of nodes.
 * 
 * This adds or removes the element's `childNodes` as necessary to match the
 * nodes indicated in the `childNodes` parameter.
 * 
 * As a performance optimization, if the supplied `childNodes` value is frozen
 * and equivalent to the last call made to this function, the function assumes
 * the child nodes are already correct and does no work.
 * 
 * @param {Element} element - the element to update
 * @param {(NodeList|Node[])} childNodes - the set of nodes to apply
 */
export function applyChildNodes(element, childNodes) {
  // Quick dirty check if last array applied was frozen.
  if (element[previousChildNodesKey] && childNodes === element[previousChildNodesKey]) {
    return;
  }

  // If the childNodes parameter is the actual childNodes of an element, then as
  // we append those nodes to the indicated target element, they'll get removed
  // from the original set. To keep the list stable, we make a copy.
  const copy = [...childNodes];

  const oldLength = element.childNodes.length;
  const newLength = copy.length;
  const length = Math.max(oldLength, newLength);
  for (let i = 0; i < length; i++) {
    const oldChild = element.childNodes[i];
    const newChild = copy[i];
    if (i >= oldLength) {
      // Add new item not in old set.
      element.appendChild(newChild);
    } else if (i >= newLength) {
      // Remove old item past end of new set.
      element.removeChild(element.childNodes[newLength]);
    } else if (oldChild !== newChild) {
      if (copy.indexOf(oldChild, i) >= i) {
        // Old node comes later in final set. Insert the new node rather than
        // replacing it so that we don't detach the old node only to have to
        // reattach it later.
        element.insertBefore(newChild, oldChild);
      } else {
        // Replace old item with new item.
        element.replaceChild(newChild, oldChild);
      }
    }
  }

  element[previousChildNodesKey] = Object.isFrozen(childNodes) ?
    childNodes :
    null;
}


/**
 * Applies multiple classes at once. This takes a dictionary in which each
 * `name: value` is equivalent to calling `classList.toggle(name, value)`.
 * 
 * @param {Element} element - the element to update
 * @param {object} classes - a dictionary of classes to apply
 */
export function applyClasses(element, classes) {
  for (const className in classes) {
    const value = classes[className] || false;
    element.classList.toggle(className, value);
  }
}


/**
 * Apply the indicated value to the element property with the given name.
 * 
 * If the value is plain JavaScript object, the value will be applied using the
 * [apply](#apply) function. Otherwise, the indicated element property will be
 * set directly to the indicated value.
 * 
 * @param {Element} element 
 * @param {string} name 
 * @param {object} value 
 */
export function applyProperty(element, name, value) {
  if (!(name in element)) {
    const nodeName = element.localName;
    /* eslint-disable no-console */
    console.warn(`Warning: attempted to set the "${name}" property of a ${nodeName}, which does not have such a property.`);
    return;
  }
  if (isPlainObject(value)) {
    // Apply value as updates.
    apply(element[name], value);
  } else {
    // Set value directly.
    element[name] = value;
  }
}


function applyReferencedElementUpdates(element, updates) {
  for (const key in updates) {
    const props = updates[key];
    const referencedElement = element.$ ?
      element.$[key] :
      element.getElementById(key);
    if (referencedElement) {
      apply(referencedElement, props);
    } else {
      throw `${element.constructor.name} attemped to update a shadow element with ID "${key}", but no such element exists.`;
    }
  }
}


/**
 * Sets multiple style values at once.
 * 
 * This takes a dictionary in which each `name: value` is equivalent to calling
 * `style[name] = value`.
 * 
 * @param {(HTMLElement|SVGElement)} element - the element to update
 * @param {object} styles - a dictionary of styles to apply
 */
export function applyStyles(element, styles) {
  for (const styleName in styles) {
    const value = styles[styleName];
    element.style[styleName] = value === undefined ? '' : value;
  }
}


function isPlainObject(o) {
  return o != null && Object.getPrototypeOf(o) === Object.prototype
}


/**
 * Merge multiple sets of updates into a single update dictionary.
 * 
 * This is similar to `Object.assign`, but:
 * * A new dictionary is always returned instead of merging into the first
 *   argument.
 * * The merge is a deep instead of shallow.
 * 
 * Example:
 * 
 *     merge(
 *       {
 *         attributes: { role: 'listbox' },
 *         classes: { foo: true, bar: true }
 *       },
 *       {
 *         classes: { foo: false, baz: true }
 *       }
 *     );
 * 
 * returns
 * 
 *     {
 *       attributes: { role: 'listbox' },
 *       classes: { foo: false, bar: true, baz: true }
 *     }
 * 
 * @param {...object} sources - a set of zero or more update dictionaries to merge
 * @returns {object} the merged updates
 */
export function merge(...sources) {
  const result = {};
  sources.forEach(source => {
    if (source) {
      for (const key in source) {
        result[key] = result[key] && isPlainObject(source[key]) ?
          // Merge object.
          merge(result[key], source[key]) :
          // No need to merge.
          source[key];
      }
    }
  })
  return result;
}
