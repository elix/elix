//
// NOTE: This is a prototype, and not yet ready for real use.
//

import * as attributes from './attributes.js';
import deepContains from './deepContains.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const appendedToDocumentKey = Symbol('appendedToDocument');
const forceAppendToBodyKey = Symbol('forceAppendToBody');
const placeholderKey = Symbol('placeholder');
const previousFocusedElementKey = Symbol('previousFocusedElement');
const previousZIndexKey = Symbol('previousZIndex');


export default function OverlayMixin(Base) {

  // The class prototype added by the mixin.
  class Overlay extends Base {

    constructor() {
      // @ts-ignore
      super();
      this.addEventListener('blur', () => {
        // The focus was taken from us, perhaps because the focus was set
        // elsewhere, so we don't want to try to restore focus when closing.
        this[previousFocusedElementKey] = null;
      });
    }

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

          if (this[appendedToDocumentKey]) {
            // The overlay wasn't in the document when opened, so we added it.
            // Remove it now.
            this.parentNode.removeChild(this);
            this[appendedToDocumentKey] = false;
          } else if (this[placeholderKey]) {
            // The overlay was moved; return it to its original location.
            this[placeholderKey].parentNode.replaceChild(this, this[placeholderKey]);
            this[placeholderKey] = null;
          }

          break;
      }
    }

    [symbols.beforeEffect](effect) {
      if (super[symbols.beforeEffect]) { super[symbols.beforeEffect](effect); }
      switch (effect) {

        case 'closing':
          // Restore previously focused element before closing.
          if (this[previousFocusedElementKey]) {
            this[previousFocusedElementKey].focus();
            this[previousFocusedElementKey] = null;
          }
          break;

        case 'opening':
          // Remember which element had the focus before we opened.
          this[previousFocusedElementKey] = document.activeElement;

          // Add the element to the document if it's not present yet.
          /** @type {any} */
          const element = this;
          const isElementInBody = deepContains(document.body, element);
          if (isElementInBody) {
            if (this.teleportToBodyOnOpen) {
              // Swap a placeholder for the overlay and move the overlay to the
              // top level of the document body.
              this[placeholderKey] = createPlaceholder(this);
              this.parentNode.replaceChild(this[placeholderKey], this);
              document.body.appendChild(element);
            }
          } else {
            // Overlay isn't in document yet.
            this[appendedToDocumentKey] = true;
            document.body.appendChild(element);
          }

          // Remember the element's current z-index.
          this[previousZIndexKey] = this.style.zIndex;
          // It seems like it should be possible to rely on inspecting zIndex
          // via getComputedStyle. However, unit testing reveals at least one
          // case where an inline zIndex style change made immediately before
          // opening the overlay was not reflected by getComputedStyle. Hence,
          // we also check the inline style value.
          // Also note that Safari returns a default zIndex of "0" for elements
          // with position: fixed, while Blink returns "auto".
          const style = getComputedStyle(element)
          const computedZIndex = style.zIndex;
          if (element.style.zIndex === ''
              && (computedZIndex === 'auto' ||
                (style.position === 'fixed' && computedZIndex === '0'))) {
            // Assign default z-index.
            this.style.zIndex = maxZIndexInUse() + 1;
          }

          // Finally make it visible and give it focus.
          makeVisible(this, true);
          this.focus();
          break;

      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      /** @type {any} */
      const element = this;
      attributes.writePendingAttributes(element);
      this.setAttribute('tabindex', '0');
    }

    /**
     * @type {boolean}
     * @default false
     */
    get teleportToBodyOnOpen() {
      return this[forceAppendToBodyKey];
    }
    set teleportToBodyOnOpen(teleportToBodyOnOpen) {
      const parsed = String(teleportToBodyOnOpen) === 'true';
      this[forceAppendToBodyKey] = parsed;
      if ('teleportToBodyOnOpen' in Base.prototype) { super.opened = parsed; }
      /** @type {any} */
      const element = this;
      attributes.setAttribute(element, 'teleport-to-body-on-open', parsed);
    }
  }

  return Overlay;

}


/*
 * Return a placeholder element used to hold an overlay's position in the DOM if
 * it is using teleportToBodyOnOpen, so that we can return the overlay to its
 * original location when it's closed.
 */
function createPlaceholder(element) {
  const message = ` Placeholder for the open ${element.localName}, which will return here when closed. `;
  const placeholder = document.createComment(message);
  return placeholder;
}


function makeVisible(element, visible) {
  attributes.setClass(element, 'visible', visible);
  console.log(`  ${visible ? 'added' : 'removed'} visible => ${element.classList}`);
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
