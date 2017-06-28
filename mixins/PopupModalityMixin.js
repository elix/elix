//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from '../mixins/Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const closeListenerKey = Symbol('closeListener');


// Expects: keydown, opened, shadowCreated
export default function PopupModalityMixin(Base) {

  // The class prototype added by the mixin.
  class PopupModality extends Base {

    constructor() {
      // @ts-ignore
      super();
      // Implicitly close on loss of focus.
      this.addEventListener('blur', () => {
        this[symbols.raiseChangeEvents] = true;
        this.close();
        this[symbols.raiseChangeEvents] = false;
      });
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }

      // Set default ARIA role for the popup.
      if (this.getAttribute('role') == null && this[symbols.defaults].role) {
        this.setAttribute('role', this[symbols.defaults].role);
      }
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.role = 'alert';
      return defaults;
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
      return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
    }

    [symbols.openedChanged](opened) {
      if (super[symbols.openedChanged]) { super[symbols.openedChanged](opened); }
      if (opened) {

        // General purpose listener for events that happen outside the
        // component.
        this[closeListenerKey] = event => {
          const insideEvent = this === event.target ||
            (event.target instanceof Node && this.contains(event.target));
          if (!insideEvent) {
            this[symbols.raiseChangeEvents] = true;
            this.close();
            this[symbols.raiseChangeEvents] = false;
          }
        };

        // Wait a tick before wiring up events — if the popup was opened
        // because the user clicked something, that opening click event may
        // still be bubbling up, and we only want to start listening after
        // it's been processed.
        setTimeout(() => {
          // It's conceivable the popup was closed before the timeout completed,
          // so double-check that it's still opened before listening to events.
          if (this.opened) {
            document.addEventListener('click', this[closeListenerKey]);
            document.addEventListener('keydown', this[closeListenerKey]);
            window.addEventListener('blur', this[closeListenerKey]);
            window.addEventListener('resize', this[closeListenerKey]);
            window.addEventListener('scroll', this[closeListenerKey]);
          }
        });
      } else {
        // Stop closing on window blur/resize/scroll.
        document.removeEventListener('click', this[closeListenerKey]);
        document.removeEventListener('keydown', this[closeListenerKey]);
        window.removeEventListener('blur', this[closeListenerKey]);
        window.removeEventListener('resize', this[closeListenerKey]);
        window.removeEventListener('scroll', this[closeListenerKey]);
      }
    }
  }

  return PopupModality;
}
