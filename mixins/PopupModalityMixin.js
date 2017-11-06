import deepContains from './deepContains.js';
import * as props from '../mixins/props.js';
import Symbol from '../mixins/Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const closeListenerKey = Symbol('closeListener');


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
 * * Event handlers that close the element if the user clicks outside the
 *   element, presses the Esc key, moves the focus outside the element, scrolls
 *   the document, resizes the document, or switches focus away from the
 *   document.
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
      super();
      this.addEventListener('blur', () => {
        this[symbols.raiseChangeEvents] = true;
        this.close();
        this[symbols.raiseChangeEvents] = false;
      });      
      this[closeListenerKey] = event => {
        const insideEvent = deepContains(this, event.target);
        if (!insideEvent) {
          this[symbols.raiseChangeEvents] = true;
          this.close();
          this[symbols.raiseChangeEvents] = false;
        }
      };
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }
      if (!this.closed) {
        // Wait a tick before wiring up events – if the popup was opened
        // because the user clicked something, that opening click event may
        // still be bubbling up, and we only want to start listening after
        // it's been processed.
        setTimeout(() => {
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
    keydown(event) {
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

    get props() {
      const original = this.state.original;
      const role = original.attributes && original.attributes.role || this.state.role;
      return props.merge(super.props, {
        attributes: {
          role
        }
      });
    }

  }

  return PopupModality;
}


function addEventListeners(element) {
  document.addEventListener('click', element[closeListenerKey]);
  document.addEventListener('keydown', element[closeListenerKey]);
  window.addEventListener('blur', element[closeListenerKey]);
  window.addEventListener('resize', element[closeListenerKey]);
  window.addEventListener('scroll', element[closeListenerKey]);
}


// Stop closing on window blur/resize/scroll.
function removeEventListeners(element) {
  document.removeEventListener('click', element[closeListenerKey]);
  document.removeEventListener('keydown', element[closeListenerKey]);
  window.removeEventListener('blur', element[closeListenerKey]);
  window.removeEventListener('resize', element[closeListenerKey]);
  window.removeEventListener('scroll', element[closeListenerKey]);
}
