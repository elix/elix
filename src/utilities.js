import * as symbols from "./symbols.js";


/**
 * Miscellaneous utility functions for web components
 * 
 * @module utilities
 */


const mousedownListenerKey = Symbol('mousedownListener');


 /**
 * Returns true if the first node contains the second, even if the second node
 * is in a shadow tree.
 *
 * The standard Node.contains() function does not account for Shadow DOM, and
 * returns false if the supplied target node is sitting inside a shadow tree
 * within the container.
 * 
 * @param {Node} container - The container to search within.
 * @param {Node} target - The node that may be inside the container.
 * @returns {boolean} - True if the container contains the target node.
 */
export function deepContains(container, target) {
  /** @type {any} */
  let current = target;
  while (current) {
    const parent = current.assignedSlot || current.parentNode || current.host;
    if (parent === container) {
      return true;
    }
    current = parent;
  }
  return false;
}


/**
 * Determine which shadow or child element the indicated element would
 * like to treat as the default element to focus on.
 * 
 * This proceeds by starting with the indicated element, seeing whether
 * it defines another element as the one which should receive the focus,
 * and repeating that process.
 * 
 * [OverlayMixin](OverlayMixin) uses this utility to determine where the focus
 * should be put when an overlay is opened.
 * 
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export function defaultFocus(element) {
  let result;
  // Keep asking if the indicated element specifies a default focus and,
  // if so, proceed there.
  for (
    result = element;
    result[symbols.defaultFocus];
    result = result[symbols.defaultFocus]
  ) {
    /* eslint-disable no-empty */
  }
  return result;
}


/**
 * Polyfill for shadowRoot.elementsFromPoint, which (as of 6 June 2018) is
 * not available in the webcomponents polyfill.
 * See https://github.com/webcomponents/shadydom/issues/141.
 * 
 * @param {Element} element - element whose shadow root may contain elements
 * at the specified point
 * @param {number} x - x-coordinate of the indicated point
 * @param {number} y - y-coordinate of the indicated point
 * @returns {Element[]}
 */
export function elementsFromPoint(element, x, y) {
  if (element.shadowRoot && element.shadowRoot.elementsFromPoint) {
    return element.shadowRoot.elementsFromPoint(x, y);
  //@ts-ignore
  } else if (document.elementsFromPoint) {
    //@ts-ignore
    return document.elementsFromPoint(x, y);
  } else {
    // Microsoft Edge

    /** @type {any} */
    const cast = document;
    const elements = cast.msElementsFromPoint(x, y);
    return elements ?
      [...elements] :
      [];
  }
}


/**
 * TODO: Docs
 * 
 * @param {HTMLElement} origin
 * @param {HTMLElement|null} target
 */
export function forwardFocus(origin, target) {
  if (origin[mousedownListenerKey]) {
    // Origin was previously forwarding focus, probably to a different target.
    // Remove the previous event listener.
    origin.removeEventListener('mousedown', origin[mousedownListenerKey]);
  }
  if (target) {
    // Using forward focus implies no tab stop.
    origin.setAttribute('tabindex', '-1');
    origin[mousedownListenerKey] = (event) => {
      // Only process events for the main (usually left) button.
      if (event.button !== 0) {
        return;
      }
      target.focus();
      event.preventDefault();
    };
    origin.addEventListener('mousedown', origin[mousedownListenerKey]);
  }
}


/**
 * Search a list element for the item that contains the specified target.
 * 
 * When dealing with UI events (e.g., mouse clicks) that may occur in
 * subelements inside a list item, you can use this routine to obtain the
 * containing list item.
 * 
 * @param {NodeList|Node[]} items - A list element containing a set of items
 * @param {Node} target - A target element that may or may not be an item in the
 * list.
 * @returns {number} - The index of the list child that is or contains the
 * indicated target node. Returns -1 if not found.
 */
export function indexOfItemContainingTarget(items, target) {
  return Array.prototype.findIndex.call(items, item =>
    item === target || deepContains(item, target)
  );
}


/**
 * Return true if the event came from within the node (or from the node itself);
 * false otherwise.
 * 
 * @param {Node} node - The node to consider in relation to the event
 * @param {Event} event - The event which may have been raised within/by the
 * node
 * @returns {boolean} - True if the event was raised within or by the node
 */
export function ownEvent(node, event) {
  /** @type {any} */
  const cast = event;
  const eventSource = cast.composedPath()[0];
  return node === eventSource || deepContains(node, eventSource);
}


/**
 * Compare a new state object against an older state object and:
 * 1. Destructively update the old state so that its field values match those
 *    of the corresponding fields in the newer state. (Fields in the new state
 *    that are not present in the old state are skipped.)
 * 2. Return a set of flags indicating which old state fields had to be changed
 *    to match the new state.
 * 
 * E.g., suppose the old state contains
 * 
 *     { a: 1, b: 'Hello' }
 * 
 * and the new state contains
 * 
 *     { a: 1, b: 'Goodbye', c: true }
 * 
 * This function updates the old state to
 * 
 *     { a: 1, b: 'Goodbye' }
 * 
 * and returns the flags
 * 
 *     { a: false, b: true }
 * 
 * Because field `a` did not change, but field `b` did.
 * 
 * This function is used by [refineState](ReactiveMixin#refineState) functions
 * that are interested in seeing whether specific state fields have changed
 * since the last call to `refineState`.
 * 
 * @param {object} newState 
 * @param {object} oldState 
 * @returns {object} - flags for the state fields that changed
 */
export function stateChanged(newState, oldState) {
  let changed = {};
  for (const property in oldState) {
    changed[property] = oldState[property] !== newState[property];
    oldState[property] = newState[property];
  }
  return changed;
}
