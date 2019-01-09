import * as symbols from './symbols.js';


/**
 * Normalizes focus treatment for custom elements with Shadow DOM.
 * 
 * The default behavior for mousedown should set the focus to the closest
 * ancestor of the clicked element that can take the focus. As of Nov 2018,
 * Chrome and Safari don't handle this as expected when the clicked element is
 * reassigned across more than one slot to end up inside a focusable element. In
 * such cases, the focus will end up on the body. Firefox exhibits the behavior
 * we want. See https://github.com/w3c/webcomponents/issues/773.
 * 
 * TODO: Document.
 * also need this for components that don't want to steal focus on mousedown
 *
 * This mixin normalizes behavior to provide what Firefox does. When the user
 * mouses down inside anywhere inside the component's light DOM or Shadow DOM,
 * we walk up the composed tree to find the first element that can take the
 * focus and put the focus on it.
 *
 * @module ComposedFocusMixin
 */
export default function ComposedFocusMixin(Base) {

  // The class prototype added by the mixin.
  class ComposedFocus extends Base {

    constructor() {
      // @ts-ignore
      super();
      if ('HTMLSlotElement' in window) {
        this.addEventListener('mousedown', event => {
          // Only process events for the main (usually left) button.
          if (event.button !== 0) {
            return;
          }
          const target = findFocusableAncestor(event.target);
          if (target) {
            target.focus();
            event.preventDefault();
          }
        });
      }
    }

  }

  return ComposedFocus;
}


// Return the closest focusable ancestor in the *composed* tree.
// If no focusable ancestor is found, returns null.
function findFocusableAncestor(element) {
  if (!element.disabled) {
    // If element wants focus to go to a specific subelement, return that.
    const focusTarget = element[symbols.focusTarget];
    if (focusTarget) {
      return focusTarget;
    }
    // Slot elements have a tabindex of 0 (which is weird); we ignore them.
    if (!(element instanceof HTMLSlotElement) && element.tabIndex >= 0) {
      // Found an enabled component that wants the focus.
      return element;
    }
  }
  const parent = element.assignedSlot ?
    element.assignedSlot :
    // @ts-ignore
    element.parentNode instanceof ShadowRoot ?
      element.parentNode.host :
      element.parentNode;
  return parent ?
    findFocusableAncestor(parent) :
    null;
}
