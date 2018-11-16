import { merge } from "./updates";


export default function ForwardFocusMixin(Base) {

  // The class prototype added by the mixin.
  class ForwardFocus extends Base {

    constructor() {
      // @ts-ignore
      super();
      this.addEventListener('mousedown', event => {
        // Only process events for the main (usually left) button.
        if (event.button !== 0) {
          return;
        }
        const forwardFocusTo = this.forwardFocusTo;
        const target = forwardFocusTo ?
          this.getRootNode().getElementById(forwardFocusTo) :
          findFocusableAncestor(event.target);
        if (target) {
          target.focus();
          event.preventDefault();
        }
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        forwardFocusTo: null
      });
    }

    get forwardFocusTo() {
      return this.state.forwardFocusTo;
    }
    set forwardFocusTo(forwardFocusTo) {
      this.setState({ forwardFocusTo });
    }

    get updates() {
      // Use of forwardFocusTo implies no tabindex.
      const base = super.updates;
      const baseTabIndex = base.attributes && base.attributes.tabindex;
      const tabindex = this.state.forwardFocusTo ?
        '-1' :
        baseTabIndex;
      return merge(super.updates, {
        attributes: {
          tabindex
        }
      });
    }
  }

  return ForwardFocus;
}


// The default behavior for mousedown should set the focus to the
// closest ancestor of the clicked element that can take the focus.
// As of Nov 2018, Chrome and Safari don't handle this as expected when
// the clicked element is reassigned across more than one slot to end up
// inside a focusable element. In such cases, the focus will end up on
// the body. See https://github.com/w3c/webcomponents/issues/773.
// As a workaround, we walk up the composed tree to find the first element
// that can take the focus and put the focus on it.
function findFocusableAncestor(element) {
  // @ts-ignore
  const parent = element.assignedSlot ?
    element.assignedSlot :
    element.parentNode instanceof ShadowRoot ?
      element.parentNode.host :
      element.parentNode;
  if (!parent) {
    return null;
  }
  if (parent === document.body ||
    (!(parent instanceof HTMLSlotElement) && parent.tabIndex >= 0)) {
    return parent;
  }
  return findFocusableAncestor(parent);
}
