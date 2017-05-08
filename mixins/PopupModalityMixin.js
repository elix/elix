import Symbol from '../mixins/Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const closeListenerSymbol = Symbol('closeListener');


// Expects: keydown, opened, backdrop, shadowCreated
export default function PopupModalityMixin(base) {

  // The class prototype added by the mixin.
  class PopupModality extends base {

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

    get opened() {
      return super.opened;
    }
    set opened(opened) {
      const changed = opened !== this.opened;
      if ('opened' in base.prototype) { super.opened = opened; }
      if (changed) {
        if (opened) {
          this[closeListenerSymbol] = () => this.close();
          window.addEventListener('scroll', this[closeListenerSymbol]);
          window.addEventListener('blur', this[closeListenerSymbol]);
          window.addEventListener('resize', this[closeListenerSymbol]);
        } else {
          window.removeEventListener('scroll', this[closeListenerSymbol]);
          window.removeEventListener('blur', this[closeListenerSymbol]);
          window.removeEventListener('resize', this[closeListenerSymbol]);
        }
      }
    }

    [symbols.shadowCreated]() {
      if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }

      // Implicitly close on background clicks.
      const backdrop = this.backdrop;
      if (!backdrop) {
        console.warn('PopupModalityMixin expects a component to define an "backdrop" property.');
      }
      backdrop.addEventListener('click', () => {
        this.close();
      });
    }
  }

  return PopupModality;
}
