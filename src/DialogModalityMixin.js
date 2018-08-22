import { merge } from './updates.js';
import * as symbols from './symbols.js';


// Symbols for private data members.
/** @type {any} */
const documentScrollingDisabledKey = Symbol('documentScrollingDisabled');
/** @type {any} */
const previousBodyOverflowKey = Symbol('previousBodyStyleOverflow');
/** @type {any} */
const previousDocumentMarginRightKey = Symbol('previousDocumentMarginRight');


/**
 * This mixin blocks various user interactions to make an overlay behave like a
 * modal dialog. This mixin is generally used in conjunction with a backdrop.
 * 
 * This mixin expects the component to provide:
 * 
 * * An open/close API compatible with `OverlayMixin`.
 * 
 * The mixin provides these features to the component:
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

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      if (this.opened && !this[documentScrollingDisabledKey]) {
        disableDocumentScrolling(this);
        this[documentScrollingDisabledKey] = true;
      } else if (this.closed && this[documentScrollingDisabledKey]) {
        enableDocumentScrolling(this);
        this[documentScrollingDisabledKey] = false;
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) { super.disconnectedCallback(); }
      enableDocumentScrolling(this);
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        role: 'dialog'
      });
    }

    [symbols.keydown](event) {
      let handled = false;

      switch (event.key) {

        case 'Escape':
          // Close on Esc key.
          this.close();
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
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
}


// Mark body as non-scrollable, to absorb space bar keypresses and other
// means of scrolling the top-level document.
function disableDocumentScrolling(element) {
  const documentWidth = document.documentElement.clientWidth;
  const scrollBarWidth = window.innerWidth - documentWidth;
  element[previousBodyOverflowKey] = document.body.style.overflow;
  element[previousDocumentMarginRightKey] = scrollBarWidth > 0 ?
    document.documentElement.style.marginRight :
    null;
  document.body.style.overflow = 'hidden';
  if (scrollBarWidth > 0) {
    document.documentElement.style.marginRight = `${scrollBarWidth}px`;
  }
}


function enableDocumentScrolling(element) {
  if (element[previousBodyOverflowKey] != null) {
    document.body.style.overflow = element[previousBodyOverflowKey];
    element[previousBodyOverflowKey] = null;
  }
  if (element[previousDocumentMarginRightKey] != null) {
    document.documentElement.style.marginRight = element[previousDocumentMarginRightKey];
    element[previousDocumentMarginRightKey] = null;
  }
}
