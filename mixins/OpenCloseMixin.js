//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from './Symbol.js';
// import attributes from './attributes.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const openedSymbol = Symbol('opened');
const resolveOpenSymbol = Symbol('resolveOpen');


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
     * This sets the `opened` property to true. If the `close` call was
     * preceded by an `open` call, then this resolves the promise returned by
     * `open`.
     */
    close(result) {
      if (super.close) { super.close(); }
      this.opened = false;
      if (this[resolveOpenSymbol]) {
        // Dialog was invoked with show().
        const resolve = this[resolveOpenSymbol];
        this[resolveOpenSymbol] = null;
        resolve(result);
      }
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
     * This sets the `opened` property to true, and returns a promise that will
     * be invoked when a corresponding `close` method call is made. The
     * resolution of the promise will be whatever parameter was passed to
     * `close`.
     */
    open() {
      this.opened = true;
      const promise = new Promise((resolve, reject) => {
        this[resolveOpenSymbol] = resolve;
      });
      return promise;
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
