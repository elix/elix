import Symbol from '../mixins/Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const previousBodyStyleOverflow = Symbol('previousBodyStyleOverflow');
const previousDocumentMarginRight = Symbol('previousDocumentMarginRight');


// Expects: keydown, opened, backdrop, shadowCreated
export default function DialogModalityMixin(Base) {

  // The class prototype added by the mixin.
  class DialogModality extends Base {

    [symbols.keydown](event) {
      let handled = false;

      switch (event.keyCode) {

        case 27: // Escape
          // Close on Esc key.
          this.close();
          handled = true;
          break;

        // case 32: // Space
        // case 33: // Page Up
        // case 34: // Page Down
        // case 35: // End
        // case 36: // Home
        // case 37: // Left
        // case 38: // Up
        // case 39: // Right
        // case 40: // Down
        //   // Disable bubbling keyboard events that could potentially scroll
        //   // the page.
        //   if (event.target === this) {
        //     disableEvent(event);
        //     handled = true;
        //   }
        //   break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
    }

    [symbols.openedChanged](opened) {
      if (super[symbols.openedChanged]) { super[symbols.openedChanged](opened); }
      if (opened) {
        // Mark body as non-scrollable, to absorb space bar keypresses and other
        // means of scrolling the top-level document.
        // HACK: This tries to play with the document margin to minimize page
        // reflow. This is just an experiment to get a feel for how awful this
        // would be.
        // TODO: Walk up the dialog's parent hierarchy and do the same for any
        // scrollable parents in it.
        const scrollBarWidth = window.innerWidth - document.body.clientWidth;
        this[previousBodyStyleOverflow] = document.body.style.overflow;
        this[previousDocumentMarginRight] = scrollBarWidth > 0 ?
          document.documentElement.style.marginRight :
          null;
        document.body.style.overflow = 'hidden';
        if (scrollBarWidth) {
          document.documentElement.style.marginRight = `${scrollBarWidth}px`;
        }
      } else {
        // Restore body's previous degree of scrollability.
        document.body.style.overflow = this[previousBodyStyleOverflow];
        document.documentElement.style.marginRight = this[previousDocumentMarginRight];
      }
    }

    // [symbols.shadowCreated]() {
    //   if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    //
    //   // Disable scrolling of the background while dialog is open.
    //   const backdrop = this.backdrop;
    //   if (!backdrop) {
    //     console.warn('DialogModalityMixin expects a component to define an "backdrop" property.');
    //   }
    //   backdrop.addEventListener('mousewheel', event => disableEvent(event));
    //   backdrop.addEventListener('touchmove', event => {
    //     // Don't disable multi-touch gestures like pinch-zoom.
    //     if (event.touches.length === 1) {
    //       disableEvent(event);
    //     }
    //   });
    // }
  }

  return DialogModality;
}


// function disableEvent(event) {
//   event.preventDefault();
//   event.stopPropagation();
// }
