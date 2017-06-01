//
// NOTE: This is a prototype, and not yet ready for real use.
//

import { toggleClass } from '../mixins/attributes.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const appendedToDocumentKey = Symbol('appendedToDocument');
const previousFocusedElementKey = Symbol('previousFocusedElement');
const previousZIndexKey = Symbol('previousZIndex');


export default function OverlayMixin(Base) {

  // The class prototype added by the mixin.
  class Overlay extends Base {

    [symbols.afterEffect](effect) {
      if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
      switch (effect) {
        case 'closing':
          // Hide the element.
          makeVisible(this, false);

          // Restore z-index.
          this.style.zIndex = this[previousZIndexKey] === '' ?
            null :
            this[previousZIndexKey];
          this[previousZIndexKey] = null;

          // If we added it to the document when opening, remove it now.
          if (this[appendedToDocumentKey]) {
            this.parentNode.removeChild(this);
            this[appendedToDocumentKey] = false;
          }

          break;
      }
    }

    [symbols.beforeEffect](effect) {
      if (super[symbols.beforeEffect]) { super[symbols.beforeEffect](effect); }
      switch (effect) {

        case 'opening':
          // Remember which element had the focus before we opened.
          this[previousFocusedElementKey] = document.activeElement;

          // Add the element to the document if it's not present yet.
          if (!isElementInBody(this)) {
            this[appendedToDocumentKey] = true;
            /** @type {any} */
            const element = this;
            document.body.appendChild(element);
          }

          // Remember the element's current z-index.
          this[previousZIndexKey] = this.style.zIndex;
          /** @type {any} */
          const element = this;
          // It seems like it should be possible to rely on inspecting zIndex
          // via getComputedStyle. However, unit testing reveals at least one
          // case where an inline zIndex style change made immediately before
          // opening the overlay was not reflected by getComputedStyle. Hence,
          // we also check the inline style value.
          if (element.style.zIndex === '' && getComputedStyle(element).zIndex === 'auto') {
            // Assign default z-index.
            this.style.zIndex = maxZIndexInUse() + 1;
          }

          // Finally make it visible and give it focus.
          makeVisible(this, true);
          this.focus();

          break;

        case 'closing':
          // Restore previously focused element before closing.
          if (this[previousFocusedElementKey]) {
            this[previousFocusedElementKey].focus();
            this[previousFocusedElementKey] = null;
          }
          break;
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // attributes.writePendingAttributes(this);
      this.setAttribute('tabindex', '0');
      if (this.opened) {
        makeVisible(this, this.opened);
      }
    }

    [symbols.openedChanged](opened) {
      if (super[symbols.openedChanged]) { super[symbols.openedChanged](opened); }
      const effect = opened ? 'opening' : 'closing';
      // Does component support async effects?
      if (this[symbols.showEffect]) {
        // Trigger asynchronous open/close.
        this[symbols.showEffect](effect);
      } else {
        // Handle synchronous open/close ourselves.
        this[symbols.beforeEffect](effect);
        this[symbols.afterEffect](effect);
      }
    }
  }

  return Overlay;

}


// Return true if the element is in the document body.
// This is like document.body.contains(), but also returns true for elements in
// shadow trees.
function isElementInBody(element) {
  if (document.body.contains(element)) {
    return true;
  }
  const parent = element.parentNode || element.host;
  return parent ?
    isElementInBody(parent) :
    false;
}


function makeVisible(element, visible) {
  toggleClass(element, 'visible', visible);
}


function maxZIndexInUse() {
  const elements = document.body.querySelectorAll('*');
  const zIndices = Array.prototype.map.call(elements, element => {
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
