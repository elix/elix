import Symbol from '../mixins/Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const previousBodyStyleOverflow = Symbol('previousBodyStyleOverflow');


// Expects: keydown, opened, backdrop, shadowCreated
export default function DialogModalityMixin(base) {

  // The class prototype added by the mixin.
  class DialogModality extends base {

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
          // Mark body as non-scrollable, to absorb space bar keypresses and other
          // means of scrolling the top-level document.
          // TODO: Walk up the dialog's parent hierarchy and do the same for any
          // scrollable parents in it.
          this[previousBodyStyleOverflow] = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = this[previousBodyStyleOverflow];
          this[previousBodyStyleOverflow] = null;
        }
      }
    }

    [symbols.shadowCreated]() {
      if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }

      // Disable scrolling of the background while dialog is open.
      const backdrop = this.backdrop;
      if (!backdrop) {
        console.warn('DialogModalityMixin expects a component to define an "backdrop" property.');
      }
      this.backdrop.addEventListener('mousewheel', event => disableEvent(event));
      this.backdrop.addEventListener('touchmove', event => {
        // Don't disable multi-touch gestures like pinch-zoom.
        if (event.touches.length === 1) {
          disableEvent(event);
        }
      });
    }
  }

  return DialogModality;
}


function disableEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
