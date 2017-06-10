//
// NOTE: This is a prototype, and not yet ready for real use.
//

import symbols from './symbols.js';


const enableEffectsKey = Symbol('enableEffects');


export default function AsyncEffectMixin(Base) {

  // The class prototype added by the mixin.
  class AsyncEffect extends Base {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }

      // Allow async effects.
      this[enableEffectsKey] = true;
    }

    // Asynchronous
    // Executes: beforeEffect, applyEffect, afterEffect
    [symbols.showEffect](effect) {

      if (super[symbols.effect]) { super[symbols.effect](effect); }

      // Tell any effect currently in progress to finish / clean up.
      if (this[symbols.currentEffect] && this[symbols.afterEffect]) {
        this[symbols.afterEffect](this[symbols.currentEffect]);
      }

      this[symbols.currentEffect] = effect;

      // Before
      if (this[symbols.beforeEffect]) {
        this[symbols.beforeEffect](effect);
      }

      // Don't show effects if user has set accessibility preference for reduced
      // motion.
      const prefersReducedMotion = matchMedia('(prefers-reduced-motion)').matches;

      // Apply
      let applyPromise;
      if (!this[enableEffectsKey] || prefersReducedMotion) {
        applyPromise = Promise.resolve();
      } else if (this[symbols.applyEffect]) {
        applyPromise = this[symbols.applyEffect](effect);
      } else {
        console.warn('AsyncEffectMixin expects a component to define an "applyEffect" method.');
        applyPromise = Promise.resolve();
      }

      return applyPromise
      .then(() => {
        // After
        if (this[symbols.currentEffect] === effect) {
          this[symbols.currentEffect] = null;
          if (this[symbols.afterEffect]) {
            this[symbols.afterEffect](effect);
          }
        }
      });
    }

  }

  return AsyncEffect;
}
