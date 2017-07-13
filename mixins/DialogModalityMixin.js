import Symbol from '../mixins/Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const previousBodyOverflowKey = Symbol('previousBodyStyleOverflow');
const previousDocumentMarginRightKey = Symbol('previousDocumentMarginRight');


/**
 * This mixin blocks various user interactions to make an overlay behave like a
 * modal dialog. This mixin is generally used in conjunction with a backdrop
 * (such as that provided by `BackdropWrapper`).
 * 
 * This mixin expects the component to provide:
 * 
 * * An open/close API compatible with `OpenCloseMixin`.
 * 
 * The mixin provides these features to the component:
 * 
 * * Disables scrolling on the background page.
 * * A default ARIA role of `dialog`.
 * * Closes the element if user presses the Esc key.
 * 
 * For modeless overlays, see `PopupModalityMixin` instead.
 * 
 * @module DialogModalityMixin
 */
export default function DialogModalityMixin(Base) {

  // The class prototype added by the mixin.
  class DialogModality extends Base {

    [symbols.afterEffect](effect) {
      if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
      if (effect === 'closing') {
        // Restore body's previous degree of scrollability.
        document.body.style.overflow = this[previousBodyOverflowKey];
        document.documentElement.style.marginRight = this[previousDocumentMarginRightKey];
      }
    }

    [symbols.beforeEffect](effect) {
      if (super[symbols.beforeEffect]) { super[symbols.beforeEffect](effect); }
      if (effect === 'opening') {
        // Mark body as non-scrollable, to absorb space bar keypresses and other
        // means of scrolling the top-level document.
        const scrollBarWidth = window.innerWidth - document.body.clientWidth;
        this[previousBodyOverflowKey] = document.body.style.overflow;
        this[previousDocumentMarginRightKey] = scrollBarWidth > 0 ?
          document.documentElement.style.marginRight :
          null;
        document.body.style.overflow = 'hidden';
        if (scrollBarWidth > 0) {
          document.documentElement.style.marginRight = `${scrollBarWidth}px`;
        }
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }

      // Set default ARIA role for the dialog.
      if (this.getAttribute('role') == null && this[symbols.defaults].role) {
        this.setAttribute('role', this[symbols.defaults].role);
      }
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.role = 'dialog';
      return defaults;
    }

    [symbols.keydown](event) {
      let handled = false;

      switch (event.keyCode) {

        case 27: // Escape
          // Close on Esc key.
          this.close();
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
    }
  }

  return DialogModality;
}
