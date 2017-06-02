//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from '../mixins/Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const closeListenerSymbol = Symbol('closeListener');


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
        this[closeListenerSymbol] = event => {
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
            document.addEventListener('click', this[closeListenerSymbol]);
            document.addEventListener('keydown', this[closeListenerSymbol]);
            window.addEventListener('blur', this[closeListenerSymbol]);
            window.addEventListener('resize', this[closeListenerSymbol]);
            window.addEventListener('scroll', this[closeListenerSymbol]);
          }
        });
      } else {
        // Stop closing on window blur/resize/scroll.
        document.removeEventListener('click', this[closeListenerSymbol]);
        document.removeEventListener('keydown', this[closeListenerSymbol]);
        window.removeEventListener('blur', this[closeListenerSymbol]);
        window.removeEventListener('resize', this[closeListenerSymbol]);
        window.removeEventListener('scroll', this[closeListenerSymbol]);
      }
    }
  }

  return PopupModality;
}
