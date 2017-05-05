import Symbol from './Symbol.js';
// import attributes from './attributes.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const openedSymbol = Symbol('opened');


/**
 * Mixin which adds close/open semantics.
 *
 * This mixin does not produce any user-visible effects. Instead it applies
 * a `opened` CSS class to the component host if the host is
 * opened, and a `opened` class if opened. It also invokes a `render`
 * function that can be overridden to apply custom effects.
 */
export default function OpenCloseMixin(base) {

  // The class prototype added by the mixin.
  class OpenClose extends base {

    constructor() {
      super();
      // Set defaults.
      // TODO: Support opening by default.
      // if (typeof this.opened === 'undefined') {
      //   this.opened = this[symbols.defaults].opened;
      // }
    }

    /**
     * Close the component.
     *
     * This is equivalent to setting the `opened` property to false.
     */
    close() {
      this.opened = false;
    }

    /**
     * True if the component is curently opened.
     *
     * @type {boolean}
     * @default false
     */
    get opened() {
      return this[openedSymbol];
    }
    set opened(opened) {
      const parsedOpened = String(opened) === 'true';
      const changed = parsedOpened !== this[openedSymbol];
      this[openedSymbol] = parsedOpened;
      if ('opened' in base.prototype) { super.opened = parsedOpened; }
      if (changed && this[symbols.raiseChangeEvents]) {
        const event = new CustomEvent('opened-changed');
        this.dispatchEvent(event);
      }
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.opened = false;
      return defaults;
    }

    /**
     * Open the component.
     *
     * This is equivalent to setting the `opened` property to true.
     */
    open() {
      this.opened = true;
    }

    /**
     * Toggle the component's open/opened state.
     */
    toggle() {
      this.opened = !this.opened;
    }

  }

  return OpenClose;
}
