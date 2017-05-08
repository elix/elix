import symbols from './symbols.js';


export default function AsyncTransitionMixin(base) {

  // The class prototype added by the mixin.
  class AsyncTransition extends base {

    // Asynchronous
    // Executes: beforeTransition, applyTransition, afterTransition
    [symbols.transition](transition) {

      if (super[symbols.transition]) { super[symbols.transition](transition); }

      // Shortcut any transition currently in progress.
      if (this[symbols.currentTransition]) {
        if (this[symbols.skipTransition]) {
          this[symbols.skipTransition](this[symbols.currentTransition]);
        }
        this[symbols.afterTransition](this[symbols.currentTransition]);
      }

      this[symbols.currentTransition] = transition;

      // Before
      if (this[symbols.beforeTransition]) {
        this[symbols.beforeTransition](transition);
      }

      // Apply
      let applyPromise;
      if (this[symbols.applyTransition]) {
        applyPromise = this[symbols.applyTransition](transition);
      } else {
        console.warn('AsyncTransitionMixin expects a component to define an "applyTransition" method.');
        applyPromise = Promise.resolve();
      }

      return applyPromise
      .then(() => {
        // After
        if (this[symbols.afterTransition]) {
          this[symbols.afterTransition](transition);
          this[symbols.currentTransition] = null;
        }
      });
    }

  }

  return AsyncTransition;
}
