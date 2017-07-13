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
 * This mixin provides a consistent public API for components that open and
 * close, including overlays and various types of expandable/collapsable
 * elements.
 * 
 * The mixin provides the following members:
 * 
 * * `opened` property that is true when open, false when closed.
 * * `open`/`close` methods that set the `opened` property and return a promise
 *   for when the open/close action has completed (including any async effects).
 * * `toggle` method which toggles the opened property.
 * * `whenOpened`/`whenClosed` promises for the next time the element
 *   opens/closes.
 * 
 * If the component defines the following optional members, the mixin will take
 * advantage of them:
 * 
 * * Effect methods compatible with TransitionEffectMixin if the element wants
 *   to define async opening/closing effects. The use of transition effects is
 *   not required. If a component doesn’t use `TransitionEffectMixin` or a
 *   compatible mixin, then `OpenCloseMixin` will perform its work
 *   synchronously, with no transition effects.
 * * `symbols.openedChanged` method that will be invoked when the opened
 *   property changes.
 * 
 * The `OpenCloseMixin` is designed to support user interface elements that have
 * two states that can be described as "opened" and “closed”. These can be
 * grouped into two top-level categories:
 * 
 * 1. Elements that open over other elements — that is, overlays.
 * 2. Elements that expand and collapse inline — these may be panels that open
 *    to reveal more detail, or list items that expand to show more detail or
 *    additional commands.
 * 
 * @module OpenCloseMixin
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
          if (this[closeResolveKey]) {
            const resolveClose = this[closeResolveKey];
            this[closeResolveKey] = null;
            resolveClose(this[closeResultKey]);
          }
          break;

        case 'opening':
          attributes.setClass(element, 'opened', true);
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
     * This sets the `opened` property to true.
     * 
     * @param {any} [result] - The result of closing the component
     * @returns {Promise} A Promise that resolves when the close operation has
     * completed, including any asynchronous visual effects. The result of the
     * promise will be the object supplied to the `close` method.
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
     * 
     * @returns {Promise} A Promise that resolves when the open operation has
     * completed, including any asynchronous visual effects.
     */
    open() {
      if (!this.opened) {
        this.opened = true;
      }
      return this[openPromiseKey];
    }

    /**
     * Toggles the component's open/opened state.
     */
    toggle() {
      this.opened = !this.opened;
    }

    /**
     * This method can be used as an alternative to listening to the
     * "opened-changed" event, particularly in situations where you want to only
     * handle the next time the component is closed.
     * 
     * @returns {Promise} A promise that resolves when the element has
     * completely closed, including the completion of any asynchronous opening
     * effect.
     */
    whenClosed() {
      return this[closePromiseKey];
    }

    /**
     * This method can be used as an alternative to listening to the
     * "opened-changed" event, particularly in situations where you want to only
     * handle the next time the component is opened.
     *
     * @returns {Promise} A promise that resolves when the element has
     * completely opened, including the completion of any asynchronous closing
     * effect.
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
