//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from './Symbol.js';
import symbols from '../mixins/symbols.js';
import * as utilities from './utilities.js';


// Symbols for private data members on an element.
const enableEffectsKey = Symbol('enableEffects');
const transitionendListenerKey = Symbol('transitionendListener');


export default function TransitionEffectMixin(Base) {

  // The class prototype added by the mixin.
  class TransitionEffect extends Base {

    [symbols.afterEffect](effect) {
      if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
      this.classList.remove(effect);
      this.classList.remove('effect');
      if (this instanceof HTMLElement) {
        utilities.webkitForceStyleUpdate(this);
      }
      if (this[transitionendListenerKey]) {
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
        this[transitionendListenerKey] = (event) => {
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
          if (this instanceof HTMLElement) {
            utilities.webkitForceStyleUpdate(this);
          }
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
      } else {
        applyPromise = this[symbols.applyEffect](effect);
      }

      return applyPromise
      .then(() => {
        // After
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
  return element[symbols.elementsWithTransitions] ?
    element[symbols.elementsWithTransitions](effect) :
    [element];
}
