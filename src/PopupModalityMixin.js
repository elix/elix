import { deepContains, ownEvent } from './utilities.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';


const implicitCloseListenerKey = Symbol('implicitCloseListener');


/**
 * This mixin makes an overlay behave like a popup by dismissing it when certain
 * user interactions occur.
 * 
 * This mixin expects the component to provide:
 * 
 * * An open/close API compatible with `OpenCloseMixin`.
 * 
 * The mixin provides these features to the component:
 * 
 * * Event handlers that close the element presses the Esc key, moves the focus
 *   outside the element, scrolls the document, resizes the document, or
 *   switches focus away from the document.
 * * A default ARIA role of `alert`.
 * 
 * For modal overlays, use `DialogModalityMixin` instead. See the documentation
 * of that mixin for a comparison of modality behaviors.
 * 
 * @module PopupModalityMixin
 */
export default function PopupModalityMixin(Base) {

  // The class prototype added by the mixin.
  class PopupModality extends Base {

    constructor() {
      // @ts-ignore
      super();

      // If we lose focus, and the new focus isn't inside us, then close.
      this.addEventListener('blur', async (event) => {
        // What has the focus now?
        const newFocusedElement = event.relatedTarget || document.activeElement;
        /** @type {any} */
        const cast = this;
        if (!deepContains(cast, newFocusedElement)) {
          this[symbols.raiseChangeEvents] = true;
          await this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      });

      // Close handlers for window events.
      this[implicitCloseListenerKey] = async (event) => {
        /** @type {any} */
        const cast = this;
        if (!ownEvent(cast, event)) {
          this[symbols.raiseChangeEvents] = true;
          await this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      };
    }

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      if (!this.closed) {
        // Wait before wiring up events – if the popup was opened because the
        // user clicked something, that opening click event may still be
        // bubbling up, and we only want to start listening after it's been
        // processed. Alternatively, if the popup caused the page to scroll, we
        // don't want to immediately close because the page scrolled (only if
        // the user scrolls).
        const callback = 'requestIdleCallback' in window ?
          window['requestIdleCallback'] :
          setTimeout;
        callback(() => {
          // It's conceivable the popup was closed before the timeout completed,
          // so double-check that it's still opened before listening to events.
          if (!this.closed) {
            addEventListeners(this);
          }
        });
      } else {
        removeEventListeners(this);
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        role: 'alert'
      });
    }

    // Close on Esc key.
    [symbols.keydown](event) {
      let handled = false;

      switch (event.keyCode) {
        case 27: // Escape
          this.close();
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super.keydown && super.keydown(event)) || false;
    }

    get updates() {
      const original = this.state.original;
      const role = original.attributes && original.attributes.role || this.state.role;
      return merge(super.updates, {
        attributes: {
          role
        }
      });
    }

  }

  return PopupModality;
}


function addEventListeners(element) {
  // Window blur event tracks loss of focus of *window*, not just element.
  window.addEventListener('blur', element[implicitCloseListenerKey]);
  window.addEventListener('resize', element[implicitCloseListenerKey]);
  window.addEventListener('scroll', element[implicitCloseListenerKey]);
}


function removeEventListeners(element) {
  window.removeEventListener('blur', element[implicitCloseListenerKey]);
  window.removeEventListener('resize', element[implicitCloseListenerKey]);
  window.removeEventListener('scroll', element[implicitCloseListenerKey]);
}
