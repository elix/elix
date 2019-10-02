import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/** @type {any} */
const closePromiseKey = Symbol('closePromise');
/** @type {any} */
const closeResolveKey = Symbol('closeResolve');

/**
 * Tracks the open/close state of a component.
 *
 * @module OpenCloseMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function OpenCloseMixin(Base) {
  // The class prototype added by the mixin.
  class OpenClose extends Base {
    /**
     * Close the component (if not already closed).
     *
     * Some components like [AlertDialog](AlertDialog) want to indicate why or
     * how they were closed. To support such scenarios, you can supply a value
     * to the optional `closeResult` parameter. This closeResult will be made
     * available in the `whenClosed` promise and the `state.closeResult` member.
     *
     * @param {object} [closeResult] - an indication of how or why the element closed
     */
    async close(closeResult) {
      if (super.close) {
        await super.close();
      }
      this[internal.setState]({ closeResult });
      await this.toggle(false);
    }

    /**
     * True if the element is currently closed.
     *
     * @type {boolean}
     */
    get closed() {
      return this[internal.state] && !this[internal.state].opened;
    }
    set closed(closed) {
      const parsed = String(closed) === 'true';
      this.toggle(!parsed);
    }

    /**
     * True if the element has completely closed.
     *
     * For components not using asynchronous open/close effects, this property
     * returns the same value as the `closed` property. For elements that have a
     * true value of `state.openCloseEffects` (e.g., elements using
     * [TransitionEffectMixin](TransitionEffectMixin)), this property returns
     * true only if `state.effect` is "close" and `state.effectPhase` is
     * "after".
     *
     * @type {boolean}
     */
    get closeFinished() {
      // TODO: Define closeFinished as computed state
      return this[internal.state].openCloseEffects
        ? this[internal.state].effect === 'close' &&
            this[internal.state].effectPhase === 'after'
        : this.closed;
    }

    get closeResult() {
      return this[internal.state].closeResult;
    }

    [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
      }

      if (changed.opened && this[internal.raiseChangeEvents]) {
        /**
         * Raised when the opened/closed state of the component changes.
         *
         * @event opened-changed
         */
        const openedChangedEvent = new CustomEvent('opened-changed', {
          detail: {
            closeResult: this[internal.state].closeResult,
            opened: this[internal.state].opened
          }
        });
        this.dispatchEvent(openedChangedEvent);

        if (this[internal.state].opened) {
          /**
           * Raised when the component opens.
           *
           * @event opened
           */
          const openedEvent = new CustomEvent('opened');
          this.dispatchEvent(openedEvent);
        } else {
          /**
           * Raised when the component closes.
           *
           * @event closed
           */
          const closedEvent = new CustomEvent('closed', {
            detail: {
              closeResult: this[internal.state].closeResult
            }
          });
          this.dispatchEvent(closedEvent);
        }
      }

      // If someone's waiting for the component to close, and it's completely
      // finished closing, then resolve the close promise.
      const closeResolve = this[closeResolveKey];
      if (this.closeFinished && closeResolve) {
        this[closeResolveKey] = null;
        this[closePromiseKey] = null;
        closeResolve(this[internal.state].closeResult);
      }
    }

    get [internal.defaultState]() {
      const defaults = {
        closeResult: null,
        opened: false
      };
      // If this component defines a `startEffect` method (e.g., by using
      // TransitionEffectMixin), include default state for open/close effects.
      // Since the component is closed by default, the default effect state is
      // after the close effect has completed.
      if (this[internal.startEffect]) {
        Object.assign(defaults, {
          effect: 'close',
          effectPhase: 'after',
          openCloseEffects: true
        });
      }
      return Object.assign(super[internal.defaultState], defaults);
    }

    /**
     * Open the element (if not already opened).
     */
    async open() {
      if (super.open) {
        await super.open();
      }
      this[internal.setState]({ closeResult: undefined });
      await this.toggle(true);
    }

    /**
     * True if the element is currently opened.
     *
     * @type {boolean}
     */
    get opened() {
      return this[internal.state] && this[internal.state].opened;
    }
    set opened(opened) {
      const parsed = String(opened) === 'true';
      this[internal.setState]({ closeResult: undefined });
      this.toggle(parsed);
    }

    /**
     * Toggle the open/close state of the element.
     *
     * @param {boolean} [opened] - true if the element should be opened, false
     * if closed.
     */
    async toggle(opened = !this.opened) {
      if (super.toggle) {
        await super.toggle(opened);
      }
      const changed = opened !== this[internal.state].opened;
      if (changed) {
        /** @type {PlainObject} */ const changes = { opened };
        if (this[internal.state].openCloseEffects) {
          changes.effect = opened ? 'open' : 'close';
          if (this[internal.state].effectPhase === 'after') {
            changes.effectPhase = 'before';
          }
        }
        await this[internal.setState](changes);
      }
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
      if (!this[closePromiseKey]) {
        this[closePromiseKey] = new Promise(resolve => {
          this[closeResolveKey] = resolve;
        });
      }
      return this[closePromiseKey];
    }
  }

  return OpenClose;
}
