//
// NOTE: This is a prototype, and not yet ready for real use.
//

import symbols from './symbols.js';


export default function AsyncEffectMixin(base) {

  // The class prototype added by the mixin.
  class AsyncEffect extends base {

    // Asynchronous
    // Executes: beforeEffect, applyEffect, afterEffect
    [symbols.showEffect](effect) {

      if (super[symbols.effect]) { super[symbols.effect](effect); }

      // Shortcut any effect currently in progress.
      if (this[symbols.currentEffect]) {
        if (this[symbols.skipEffect]) {
          this[symbols.skipEffect](this[symbols.currentEffect]);
        }
        this[symbols.afterEffect](this[symbols.currentEffect]);
      }

      this[symbols.currentEffect] = effect;

      // Before
      if (this[symbols.beforeEffect]) {
        this[symbols.beforeEffect](effect);
      }

      // Apply
      let applyPromise;
      if (this[symbols.applyEffect]) {
        applyPromise = this[symbols.applyEffect](effect);
      } else {
        console.warn('AsyncEffectMixin expects a component to define an "applyEffect" method.');
        applyPromise = Promise.resolve();
      }

      return applyPromise
      .then(() => {
        // After
        if (this[symbols.afterEffect]) {
          this[symbols.afterEffect](effect);
          this[symbols.currentEffect] = null;
        }
      });
    }

  }

  return AsyncEffect;
}
