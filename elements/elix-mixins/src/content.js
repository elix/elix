/**
 * Helpers for accessing a component's content.
 *
 * The standard DOM API provides several ways of accessing child content:
 * `children`, `childNodes`, and `textContent`. None of these functions are
 * Shadow DOM aware. This mixin defines variations of those functions that
 * *are* Shadow DOM aware.
 *
 * Example: you create a component `<count-children>` that displays a number
 * equal to the number of children placed inside that component. If someone
 * instantiates your component like:
 *
 *     <count-children>
 *       <div></div>
 *       <div></div>
 *       <div></div>
 *     </count-children>
 *
 * Then the component should show "3", because there are three children. To
 * calculate the number of children, the component can just calculate
 * `this.children.length`. However, suppose someone instantiates your
 * component inside one of their own components, and puts a `<slot>` element
 * inside your component:
 *
 *     <count-children>
 *       <slot></slot>
 *     </count-children>
 *
 * If your component only looks at `this.children`, it will always see exactly
 * one child — the `<slot>` element. But the user looking at the page will
 * *see* any nodes distributed to that slot. To match what the user sees, your
 * component should expand any `<slot>` elements it contains.
 *
 * That is one problem these helpers solve. For example, the helper
 * `assignedChildren` will return all children assigned to your component in
 * the composed tree.
 *
 * @module content
 */

/**
 * An in-order collection of distributed children, expanding any slot
 * elements. Like the standard `children` property, this skips text and other
 * node types which are not Element instances.
 *
 * @param {HTMLElement} element - the element to inspect
 * @returns {Element[]} - the children assigned to the element
 */
export function assignedChildren(element) {
  return expandAssignedNodes(element.children, true);
}

/**
 * An in-order collection of distributed child nodes, expanding any slot
 * elements. Like the standard `childNodes` property, this includes text and
 * other types of nodes.
 *
 * @param {HTMLElement} element - the element to inspect
 * @returns {Node[]} - the nodes assigned to the element
 */
export function assignedChildNodes(element) {
  return expandAssignedNodes(element.childNodes, false);
}

/**
 * The concatenated `textContent` of all distributed child nodes, expanding
 * any slot elements.
 *
 * @param {HTMLElement} element - the element to inspect
 * @type {string} - the text content of all nodes assigned to the element
 */
export function assignedTextContent(element) {
  const strings = assignedChildNodes(element).map(
    child => child.textContent
  );
  return strings.join('');
}

/**
 * Return the given elements, filtering out auxiliary elements that aren't
 * typically visible. Given a `NodeList` or array of objects, it will only
 * return array members that are instances of `Element` (`HTMLElement` or
 * `SVGElement`), and not on a blacklist of normally invisible elements
 * (such as `style` or `script`).
 *
 * @param {NodeList|Element[]} elements - the list of elements to filter
 * @returns {Element[]} - the filtered elements
 */
export function filterAuxiliaryElements(elements) {

  // These are tags that can appear in the document body, but do not seem to
  // have any user-visible manifestation.
  // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element
  const auxiliaryTags = [
    'applet',         // deprecated
    'basefont',       // deprecated
    'embed',
    'font',           // deprecated
    'frame',          // deprecated
    'frameset',       // deprecated
    'isindex',        // deprecated
    'keygen',         // deprecated
    'link',
    'multicol',       // deprecated
    'nextid',         // deprecated
    'noscript',
    'object',
    'param',
    'script',
    'style',
    'template',
    'noembed'         // deprecated
  ];

  return [].filter.call(elements,
    element => element instanceof Element &&
        (!element.localName || auxiliaryTags.indexOf(element.localName) < 0)
  );
}

//
// Helpers for the helper functions
//

/*
 * Given a array of nodes, return a new array with any `slot` elements expanded
 * to the nodes assigned to those slots.
 *
 * If ElementsOnly is true, only Element instances are returned, as with the
 * standard `children` property. Otherwise, all nodes are returned, as in the
 * standard `childNodes` property.
 */
function expandAssignedNodes(nodes, ElementsOnly) {
  const expanded = Array.prototype.map.call(nodes, node => {

    // We want to see if the node is an instanceof HTMLSlotELement, but
    // that class won't exist if the browser that doesn't support native
    // Shadow DOM and if the Shadow DOM polyfill hasn't been loaded. Instead,
    // we do a simplistic check to see if the tag name is "slot".
    const isSlot = typeof HTMLSlotElement !== 'undefined' ?
      node instanceof HTMLSlotElement :
      node.localName === 'slot';

    return isSlot ?
      node.assignedNodes({ flatten: true }) :
      [node];
  });
  const flattened = [].concat(...expanded);
  const result = ElementsOnly ?
    flattened.filter(node => node instanceof Element) :
    flattened;
  return result;
}
