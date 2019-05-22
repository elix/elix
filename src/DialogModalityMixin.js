import * as symbols from './symbols.js';


// Symbols for private data members.
/** @type {any} */
const previousBodyOverflowKey = Symbol('previousBodyStyleOverflow');
/** @type {any} */
const previousDocumentMarginRightKey = Symbol('previousDocumentMarginRight');


/**
 * Gives an overlay modal behavior.
 * 
 * This blocks various user interactions to make an overlay behave like a modal
 * dialog:
 * 
 * * Disables scrolling on the background document. **This is a global
 *   side-effect of opening the component.**
 * * A default ARIA role of `dialog`.
 * * Closes the element if user presses the Esc key.
 * 
 * For modeless overlays, see `PopupModalityMixin` instead.
 * 
 * @module DialogModalityMixin
 */
export default function DialogModalityMixin(Base) {
  return class DialogModality extends Base {

    get defaultState() {
      return Object.assign(super.defaultState, {
        role: 'dialog'
      });
    }

    [symbols.keydown](event) {
      let handled = false;

      switch (event.key) {

        case 'Escape':
          // Close on Esc key.
          this.close({
            canceled: 'Escape'
          });
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
    }

    [symbols.render](changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }
      if (changed.opened) {
        if (this.state.opened && document.documentElement) {
          // Disable body scrolling to absorb space bar keypresses and other
          // means of scrolling the top-level document.
          const documentWidth = document.documentElement.clientWidth;
          const scrollBarWidth = window.innerWidth - documentWidth;
          this[previousBodyOverflowKey] = document.body.style.overflow;
          this[previousDocumentMarginRightKey] = scrollBarWidth > 0 ?
            document.documentElement.style.marginRight :
            null;
          document.body.style.overflow = 'hidden';
          if (scrollBarWidth > 0) {
            document.documentElement.style.marginRight = `${scrollBarWidth}px`;
          }
        } else {
          // Reenable body scrolling.
          if (this[previousBodyOverflowKey] != null) {
            document.body.style.overflow = this[previousBodyOverflowKey];
            this[previousBodyOverflowKey] = null;
          }
          if (this[previousDocumentMarginRightKey] != null) {
            document.documentElement.style.marginRight = this[previousDocumentMarginRightKey];
            this[previousDocumentMarginRightKey] = null;
          }
        }
      }
      if (changed.role) {
        // Apply top-level role.
        const { role } = this.state;
        this.setAttribute('role', role);
      }
    }

    // Setting the standard role attribute will invoke this property setter,
    // which will allow us to update our state.
    get role() {
      return super.role;
    }
    set role(role) {
      super.role = role;
      if (!this[symbols.rendering]) {
        this.setState({
          role
        });
      }
    }

  }
  
}
