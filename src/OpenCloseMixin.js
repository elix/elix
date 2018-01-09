import Symbol from './Symbol.js';


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

    async close(result) {
      if (super.close) { await super.close(); }
      this.setState({ result });
      await this.toggle(false);
    }

    get closed() {
      return !this.state.opened;
    }
    set closed(closed) {
      const parsed = String(closed) === 'true';
      this.toggle(!parsed);
    }

    get closeFinished() {
      return this.state.openCloseEffects ?
        this.state.effect === 'close' && this.state.effectPhase === 'after' :
        this.closed;
    }

    get defaultState() {
      const defaults = {
        opened: false
      };
      // If this component defines a `startEffect` method (e.g., by using
      // TransitionEffectMixin), include default state for open/close effects.
      // Since the component is closed by default, the default effect state is
      // after the close effect has completed.
      if (this.startEffect) {
        Object.assign(defaults, {
          effect: 'close',
          effectPhase: 'after'
        });
      }
      return Object.assign({}, super.defaultState, defaults);
    }

    async open() {
      if (super.open) { await super.open(); }
      await this.toggle(true);
    }

    get opened() {
      return this.state.opened;
    }
    set opened(opened) {
      const parsed = String(opened) === 'true';
      this.toggle(parsed);
    }

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
