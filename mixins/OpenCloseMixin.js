//
// NOTE: This is a prototype, and not yet ready for real use.
//

import * as attributes from './attributes.js';
import Symbol from './Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const closePromiseKey = Symbol('closePromise');
const closeResolveKey = Symbol('closeResolve');
const closeResultKey = Symbol('closeResult');
const openedKey = Symbol('opened');
const openPromiseKey = Symbol('openPromise');
const openResolveKey = Symbol('openResolve');


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

      createOpenPromise(this);
      createClosePromise(this);

      // Set defaults.
      if (typeof this.opened === 'undefined') {
        this.opened = this[symbols.defaults].opened;
      }
    }

    [symbols.afterEffect](effect) {
      if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
      /** @type {any} */
      const element = this;
      switch (effect) {

        case 'closing':
          attributes.setClass(element, 'opened', false);
          console.log(`  removed opened => ${this.classList}`);
          if (this[closeResolveKey]) {
            const resolveClose = this[closeResolveKey];
            this[closeResolveKey] = null;
            resolveClose(this[closeResultKey]);
          }
          break;

        case 'opening':
          attributes.setClass(element, 'opened', true);
          console.log(`  added opened => ${this.classList}`);
          if (this[openResolveKey]) {
            const resolveOpen = this[openResolveKey];
            this[openResolveKey] = null;
            resolveOpen();
          }
          break;
      }
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
        this[closeResultKey] = result;
        this.opened = false;
      }
      return this[closePromiseKey];
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.opened = false;
      return defaults;
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

        // Set up a new promise for opposite of action we're doing.
        if (opened) {
          createClosePromise(this);
        } else {
          createOpenPromise(this);
        }

        if (this[symbols.openedChanged]) {
          this[symbols.openedChanged](parsedOpened);
        }

        const effect = opened ? 'opening' : 'closing';
        // Does component support async effects?
        if (this[symbols.showEffect]) {
          // Trigger asynchronous open/close.
          this[symbols.showEffect](effect);
        } else {
          // Invoke synchronous open/close.
          if (this[symbols.beforeEffect]) {
            this[symbols.beforeEffect](effect);
          }
          this[symbols.afterEffect](effect);
        }

        if (this[symbols.raiseChangeEvents]) {
          const event = new CustomEvent('opened-changed');
          this.dispatchEvent(event);
        }
      }
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
        this.opened = true;
      }
      return this[openPromiseKey];
    }

    /**
     * Toggle the component's open/opened state.
     */
    toggle() {
      this.opened = !this.opened;
    }

    /**
     * @returns {Promise} A promise resolved when the element has completely closed,
     * including the completion of any asynchronous opening effect.
     */
    whenClosed() {
      return this[closePromiseKey];
    }

    /**
     * @returns {Promise} A promise resolved when the element has completely opened,
     * including the completion of any asynchronous closing effect.
     */
    whenOpened() {
      return this[openPromiseKey];
    }

  }

  return OpenClose;
}


function createClosePromise(element) {
  element[closePromiseKey] = new Promise((resolve, reject) => {
    element[closeResolveKey] = resolve;
  });
}

function createOpenPromise(element) {
  element[openPromiseKey] = new Promise((resolve, reject) => {
    element[openResolveKey] = resolve;
  });
}
