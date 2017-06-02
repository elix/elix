//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from './Symbol.js';
// import attributes from './attributes.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const openedKey = Symbol('opened');
const closePromiseKey = Symbol('closePromise');
const closeResolveKey = Symbol('resolveOpen');


/**
 * Mixin which adds close/open semantics.
 *
 * This mixin does not produce any user-visible effects. Instead it applies
 * a `opened` CSS class to the component host if the host is
 * opened, and a `opened` class if opened. It also invokes a `render`
 * function that can be overridden to apply custom effects.
 */
export default function OpenCloseMixin(Base) {

  // The class prototype added by the mixin.
  class OpenClose extends Base {

    constructor() {
      // @ts-ignore
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
     * 
     * @param {any} [result] - The result of closing the overlay
     */
    close(result) {
      if (super.close) { super.close(); }
      if (this.opened) {
        this.opened = false;
        if (this[closeResolveKey]) {
          // Element was opened with open().
          const resolve = this[closeResolveKey];
          this[closeResolveKey] = null;
          this[closePromiseKey] = null;
          resolve(result);
        }
      }
    }

    /**
     * True if the component is curently opened.
     *
     * @type {boolean}
     * @default false
     */
    get opened() {
      return this[openedKey];
    }
    /**
     * @param {boolean} opened
     */
    set opened(opened) {
      const parsedOpened = String(opened) === 'true';
      const changed = parsedOpened !== this[openedKey];
      this[openedKey] = parsedOpened;
      if ('opened' in Base.prototype) { super.opened = parsedOpened; }
      if (changed) {
        if (this[symbols.openedChanged]) {
          this[symbols.openedChanged](parsedOpened);
        }
        if (this[symbols.raiseChangeEvents]) {
          const event = new CustomEvent('opened-changed');
          this.dispatchEvent(event);
        }
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
      if (!this.opened) {
        this[closePromiseKey] = new Promise((resolve, reject) => {
          this[closeResolveKey] = resolve;
        });
        this.opened = true;
      }
      return this[closePromiseKey];
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
