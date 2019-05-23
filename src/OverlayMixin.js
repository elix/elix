import { deepContains, firstFocusableElement } from './utilities.js';
import * as symbols from './symbols.js';


/** @type {any} */
const defaultZIndexKey = Symbol('assignedZIndex');
/** @type {any} */
const restoreFocusToElementKey = Symbol('restoreFocusToElement');


/**
 * Displays an opened element on top of other page elements.
 * 
 * This mixin handles showing and hiding an overlay element. It, together with
 * [OpenCloseMixin](OpenCloseMixin), form the core behavior for [Overlay](Overlay),
 * which in turn forms the basis of Elix's overlay components.
 * 
 * @module OverlayMixin
 */
export default function OverlayMixin(Base) {

  // The class prototype added by the mixin.
  class Overlay extends Base {

    constructor() {
      // @ts-ignore
      super();
      this.addEventListener('blur', event => {
        // What has the focus now?
        const newFocusedElement = event.relatedTarget || document.activeElement;
        /** @type {any} */
        const node = this;
        const focusInside = deepContains(node, newFocusedElement);
        if (!focusInside) {
          if (this.opened) {
            // The user has most likely clicked on something in the background
            // of a modeless overlay. Remember that element, and restore focus
            // to it when the overlay finishes closing.
            this[restoreFocusToElementKey] = newFocusedElement;
          } else {
            // A blur event fired, but the overlay closed itself before the blur
            // event could be processed. In closing, we may have already
            // restored the focus to the element that originally invoked the
            // overlay. Since the user has clicked somewhere else to close the
            // overlay, put the focus where they wanted it.
            newFocusedElement.focus();
            this[restoreFocusToElementKey] = null;
          }
        }
      });
    }

    // TODO: Document
    get autoFocus() {
      return this.state.autoFocus;
    }
    set autoFocus(autoFocus) {
      this.setState({ autoFocus });
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      openedChanged(this);
    }

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      if (changed.opened) {
        openedChanged(this);
      }
    }

    get defaultState() {
      return Object.assign(super.defaultState, {
        autoFocus: true
      });
    }

    [symbols.render](changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }
      if (changed.effectPhase || changed.opened) {
        const closed = typeof this.closeFinished === 'undefined' ?
          this.closed :
          this.closeFinished;

        // We'd like to just use the `hidden` attribute, but Edge has trouble
        // with that: if the hidden attribute is removed from an overlay to
        // display it, Edge may not paint it correctly. And a side-effect
        // of styling with the hidden attribute is that naive styling of the
        // component from the outside (to change to display: flex, say) will
        // override the display: none implied by hidden. To work around both
        // these problems, we use display: none when the overlay is closed.
        this.style.display = closed ? 'none' : null;

        if (closed) {
          if (this[defaultZIndexKey]) {
            // Remove default z-index.
            this.style.zIndex = null;
            this[defaultZIndexKey] = null;
          }
        } else if (this[defaultZIndexKey]) {
          this.style.zIndex = this[defaultZIndexKey];
        } else {
          const cast = /** @type {any} */ (this);
          const computedZIndex = getComputedStyle(cast).zIndex;
          if (computedZIndex === 'auto' && this.style.zIndex === '') {
            // No z-index has been assigned to this element via CSS.
            // Pick a default z-index, remember it, and apply it.
            const defaultZIndex = maxZIndexInUse() + 1;
            this[defaultZIndexKey] = defaultZIndex;
            this.style.zIndex = defaultZIndex;
          }
        }
      }
    }
  }

  return Overlay;
}


/*
 * Return the highest z-index currently in use in the document's light DOM.
 * 
 * This calculation looks at all light DOM elements, so is theoretically
 * expensive. That said, it only runs when an overlay is opening, and is only used
 * if an overlay doesn't have a z-index already. In cases where performance is
 * an issue, this calculation can be completely circumvented by manually
 * applying a z-index to an overlay.
 */
function maxZIndexInUse() {
  const elements = document.body.querySelectorAll('*');
  const zIndices = Array.from(elements, element => {
    const style = getComputedStyle(element);
    let zIndex = 0;
    if (style.position !== 'static' && style.zIndex !== 'auto') {
      const parsed = style.zIndex ? parseInt(style.zIndex) : 0;
      zIndex = !isNaN(parsed) ? parsed : 0;
    }
    return zIndex;
  });
  return Math.max(...zIndices);
}


// Update the overlay following a change in opened state.
function openedChanged(element) {
  if (element.state.autoFocus) {
    if (element.state.opened) {
      // Opened
      if (!element[restoreFocusToElementKey] && document.activeElement !== document.body) {
        // Remember which element had the focus before we were opened.
        element[restoreFocusToElementKey] = document.activeElement;
      }
      // Focus on the element itself (if it's focusable), or the first focusable
      // element inside it.
      // TODO: We'd prefer to require that overlays (like the Overlay base
      // class) make use of delegatesFocus via DelegateFocusMixin, which would
      // let us drop the need for this mixin here to do anything special with
      // focus. However, an initial trial of this revealed an issue in
      // MenuButton, where invoking the menu did not put the focus on the first
      // menu item as expected. Needs more investigation.
      const focusElement = firstFocusableElement(element);
      if (focusElement) {
        focusElement.focus();
      }
    } else {
      // Closed
      if (element[restoreFocusToElementKey]) {
        // Restore focus to the element that had the focus before the overlay was
        // opened.
        element[restoreFocusToElementKey].focus();
        element[restoreFocusToElementKey] = null;
      }
    }
  }
}
