//
// NOTE: This is a prototype, and not yet ready for real use.
//

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
          makeVisible(this, false);
          if (this[previousZIndexKey] === '') {
            this.style.zIndex = null;
          }
          this[previousZIndexKey] = null;
          break;
      }
    }

    [symbols.beforeEffect](effect) {
      if (super[symbols.beforeEffect]) { super[symbols.beforeEffect](effect); }
      switch (effect) {
        case 'opening':
          this[previousFocusedElementKey] = document.activeElement;
          this[previousZIndexKey] = this.style.zIndex;
          /** @type {any} */
          const element = this;
          if (getComputedStyle(element).zIndex === 'auto') {
            // Assign default z-index.
            this.style.zIndex = maxZIndexInUse() + 1;
          }
          makeVisible(this, true);
          this.focus();
          break;

        case 'closing':
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

    get opened() {
      return super.opened;
    }
    set opened(opened) {
      const parsedOpened = String(opened) === 'true';
      const changed = parsedOpened !== this.opened;
      if ('opened' in Base.prototype) { super.opened = parsedOpened; }
      if (changed) {
        if (parsedOpened) {
          // Opening
          if (!isElementInDocument(this)) {
            this[appendedToDocumentKey] = true;
            /** @type {any} */
            const element = this;
            document.body.appendChild(element);
          }
        }
        if (!this[symbols.applyEffect]) {
          // Do synchronous open/close.
          const effect = parsedOpened ? 'opening' : 'closing';
          this[symbols.beforeEffect](effect);
          this[symbols.afterEffect](effect);
        }
        if (!parsedOpened) {
          // Closing
          if (this[appendedToDocumentKey]) {
            this.parentNode.removeChild(this);
            this[appendedToDocumentKey] = false;
          }
        }
      }
    }
  }

  return Overlay;

}


// Return true if the element is in the document.
// This is like document.contains(), but also returns true for elements in
// shadow trees.
function isElementInDocument(element) {
  if (document.contains(element)) {
    return true;
  }
  const parent = element.parentNode || element.host;
  return parent ?
    isElementInDocument(parent) :
    false;
}


function makeVisible(element, visible) {
  element.classList.toggle('visible', visible);
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
