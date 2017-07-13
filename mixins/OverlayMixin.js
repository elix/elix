import * as attributes from './attributes.js';
import deepContains from './deepContains.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


// Symbols for private data members on an element.
const appendedToDocumentKey = Symbol('appendedToDocument');
const forceAppendToBodyKey = Symbol('forceAppendToBody');
const placeholderKey = Symbol('placeholder');
const previousFocusedElementKey = Symbol('previousFocusedElement');
const previousZIndexKey = Symbol('previousZIndex');


/**
 * This mixin makes an opened element appear on top of other page elements, then
 * hide or remove it when closed. This mixin and `OpenCloseMixin` form the core
 * overlay behavior for Elix components.
 * 
 * The mixin expects the component to provide:
 * 
 * * An invocation of `symbols.beforeEffect` and `symbols.afterEffect` methods
 *   for both "opening" and “closing” effects. This is generally implemented by
 *   using `OpenCloseMixin`.
 * 
 * The mixin provides these features to the component:
 * 
 * 1. Appends the element to the DOM when opened, if it’s not already in the
 *    DOM.
 * 2. Can calculate and apply a default z-index that in many cases will be
 *    sufficient to have the overlay appear on top of other page elements.
 * 3. Makes the element visible before any opening effects begin, and hides it
 *    after any closing effects complete.
 * 4. Remembers which element had the focus before the overlay was opened, and
 *    tries to restore the focus there when the overlay is closed.
 * 5. A `teleportToBodyOnOpen` property that optionally moves an element already
 *    in the DOM to the end of the document body when opened. This is intended
 *    only to address challenging overlay edge cases; see the discussion below.
 * 
 * If the component defines the following optional members, the mixin will take
 * advantage of them:
 * 
 * * An effect API compatible with `TransitionEffectMixin`. This allows an
 *   element to provide opening/closing effects. The effects are _not_ applied
 *   if the `opened` property is set in markup when the document is loading. The
 *   use of transition effects is not required. It is not necessary for a
 *   component to use `TransitionEffectMixin` or a compatible mixin. In that
 *   case, `OverlayMixin` will simply perform its work synchronously.
 * 
 * All other aspects of overlay behavior are handled by other mixins and
 * wrappers. For example, addition of a backdrop element behind the overlay is
 * handled by `BackdropWrapper`. Intercepting and responding to UI events is
 * handled by `PopupModalityMixin` and `DialogModalityMixin`. Management of
 * asynchronous visual opening/closing effects are provided by
 * `TransitionEffectMixin`.
 * 
 * @module OverlayMixin
 */
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
     * True if the overlay should be moved from its existing place in the DOM to
     * the end of the document body when the overlay is opened, then returned to
     * its original location when closed. This property exists to address a
     * small number of challenging overlay edge cases, and should generally be
     * left false.
     * 
     * @type {boolean}
     * @default false
     */
    get teleportToBodyOnOpen() {
      return this[forceAppendToBodyKey];
    }
    /**
     * @param {boolean} teleportToBodyOnOpen
     */
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
