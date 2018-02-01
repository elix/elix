import * as symbols from './symbols.js';


const closePromiseKey = Symbol('closePromise');
const closeResolveKey = Symbol('closeResolve');


/**
 * Mixin which tracks the open/close state of a component.
 * 
 * @module OpenCloseMixin
 */
export default function OpenCloseMixin(Base) {

  // The class prototype added by the mixin.
  class OpenClose extends Base {

    /**
     * Close the component (if not already closed).
     * 
     * Some components like [AlertDialog](AlertDialog) want to indicate why or
     * how they were closed. To support such scenarios, you can supply a value
     * to the optional `result` parameter. This result will be made available
     * in the `whenClosed` promise and the `state.result` member.
     * 
     * @param {object} [result] - an indication of how or why the element closed
     */
    async close(result) {
      if (super.close) { await super.close(); }
      this.setState({ result });
      await this.toggle(false);
    }

    /**
     * True if the element is currently closed.
     * 
     * @type {boolean}
     */
    get closed() {
      return !this.state.opened;
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
      return this.state.openCloseEffects ?
        this.state.effect === 'close' && this.state.effectPhase === 'after' :
        this.closed;
    }

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

      if (this.state.opened !== previousState.opened && this[symbols.raiseChangeEvents]) {
        /**
         * Raised when the opened/closed state of the component changes.
         * 
         * @event OpenCloseMixin#opened-changed
         */
        const event = new CustomEvent('opened-changed', {
          detail: {
            opened: this.state.opened
          }
        });
        this.dispatchEvent(event);
      }

      // If someone's waiting for the component to close, and it's completely
      // finished closing, then resolve the close promise.
      const closeResolve = this[closeResolveKey];
      if (this.closeFinished && closeResolve) {
        this[closeResolveKey] = null;
        this[closePromiseKey] = null;
        closeResolve(this.state.result);
      }
    }

    get defaultState() {
      const defaults = {
        opened: false
      };
      // If this component defines a `startEffect` method (e.g., by using
      // TransitionEffectMixin), include default state for open/close effects.
      // Since the component is closed by default, the default effect state is
      // after the close effect has completed.
      if (this[symbols.startEffect]) {
        Object.assign(defaults, {
          effect: 'close',
          effectPhase: 'after',
          openCloseEffects: true
        });
      }
      return Object.assign({}, super.defaultState, defaults);
    }

    /**
     * Open the element (if not already opened).
     */
    async open() {
      if (super.open) { await super.open(); }
      await this.toggle(true);
    }

    /**
     * True if the element is currently closed.
     * 
     * @type {boolean}
     */
    get opened() {
      return this.state.opened;
    }
    set opened(opened) {
      const parsed = String(opened) === 'true';
      this.toggle(parsed);
    }

    /**
     * Toggle the open/close state of the element.
     * 
     * @param {boolean} [opened] - true if the element should be opened, false
     * if closed.
     */
    async toggle(opened = !this.opened) {
      if (super.toggle) { await super.toggle(opened); }
      const changed = opened !== this.state.opened;
      if (changed) {
        const changes = { opened };
        if (this.state.openCloseEffects) {
          changes.effect = opened ? 'open' : 'close';
          if (this.state.effectPhase === 'after') {
            changes.effectPhase = 'before';
          }
        }
        await this.setState(changes);
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
