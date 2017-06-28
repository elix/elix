//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from './Symbol.js';
import symbols from '../mixins/symbols.js';


// Symbols for private data members on an element.
const enableEffectsKey = Symbol('enableEffects');
const transitionendListenerKey = Symbol('transitionendListener');


// For now, assumes transition effects are applied at least to the overlay
// content element, and that all effects finish at the same time.
export default function TransitionEffectMixin(Base) {

  // The class prototype added by the mixin.
  class TransitionEffect extends Base {

    [symbols.afterEffect](effect) {
      if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
      this.classList.remove(effect);
      this.classList.remove('effect');
      console.log(`  removed ${effect} => ${this.classList}`);
      if (this[transitionendListenerKey]) {
        console.log(`  removing event listeners`);
        getTransitionElements(this, effect).forEach(element => {
          element.removeEventListener('transitionend', this[transitionendListenerKey]);
        });
        this[transitionendListenerKey] = null;
      }
    }

    [symbols.applyEffect](effect) {
      const base = super.applyEffect ? super[symbols.applyEffect](effect) : Promise.resolve();

      const animationEndPromise = new Promise((resolve, reject) => {
        // Set up to handle a transitionend event once.
        // The handler will be removed when the promise resolves.
        const temp = effect;
        this[transitionendListenerKey] = (event) => {
          console.log(`  resolving animationEndPromise ${temp}`);
          console.log(event.target);
          event.stopPropagation();
          resolve();
        };
      });

      const animationStartPromise = new Promise((resolve, reject) => {
        // Apply the effect.
        requestAnimationFrame(() => {

          getTransitionElements(this, effect).forEach(element => {
            element.addEventListener('transitionend', this[transitionendListenerKey]);
          });
          
          this.classList.add(effect);
          this.classList.add('effect');
          console.log(`  added ${effect} => ${this.classList}`);
          resolve();
        });
      });

      return base
      .then(() => animationStartPromise)
      .then(() => animationEndPromise);
    }

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
      if (this[symbols.currentEffect]) {
        console.log(`* after ${this[symbols.currentEffect]}`);
        this[symbols.afterEffect](this[symbols.currentEffect]);
      }

      this[symbols.currentEffect] = effect;

      // Before
      if (this[symbols.beforeEffect]) {
        console.log(`before ${effect}`);
        this[symbols.beforeEffect](effect);
      }

      // Don't show effects if user has set accessibility preference for reduced
      // motion.
      const prefersReducedMotion = matchMedia('(prefers-reduced-motion)').matches;

      // Apply
      let applyPromise;
      if (!this[enableEffectsKey] || prefersReducedMotion) {
        applyPromise = Promise.resolve();
      } else {
        console.log(`apply ${effect}`);
        applyPromise = this[symbols.applyEffect](effect);
      }

      return applyPromise
      .then(() => {
        // After
        console.log(`after ${effect}`);
        if (this[symbols.currentEffect] === effect) {
          this[symbols.currentEffect] = null;
          this[symbols.afterEffect](effect);
        }
      });
    }

  }

  return TransitionEffect;
}


function getTransitionElements(element, effect) {
  return element[symbols.elementsWithEffectTransitions](effect) || [element];
}
