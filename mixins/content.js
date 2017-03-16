/**
 * Helpers for accessing a component's content.
 *
 * @module content
 */

/**
 * Return a set of Elements which are likely to be useful as component content.
 *
 * Given a `NodeList` or array of objects, this will return only those array
 * members that are: a) instances of `Element` (`HTMLElement` or `SVGElement`),
 * and b) not on a blacklist of normally invisible elements (such as `style` or
 * `script`). Among other things, this filters out Text nodes.
 *
 * @param {NodeList|Node[]} nodes - the list of nodes to filter
 * @returns {Element[]} - the filtered elements
 */
export function substantiveElements(nodes) {

  // These are tags for elements that can appear in the document body, but do
  // not seem to have any user-visible manifestation.
  // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element
  const auxiliaryElementTags = [
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

  return [].filter.call(nodes,
    node => node instanceof Element &&
        (!node.localName || auxiliaryElementTags.indexOf(node.localName) < 0)
  );
}
