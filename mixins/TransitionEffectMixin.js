//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from './Symbol.js';
import symbols from '../mixins/symbols.js';


const transitionendListener = Symbol('transitionendListener');


// For now, assumes transition effects are applied at least to the overlay
// content element, and that all effects finish at the same time.
export default function TransitionEffectMixin(Base) {

  // The class prototype added by the mixin.
  class TransitionEffect extends Base {

    [symbols.applyEffect](effect) {
      const base = super.applyEffect ? super[symbols.applyEffect](effect) : Promise.resolve();

      const animationEndPromise = new Promise((resolve, reject) => {
        // Set up to handle a transitionend event once.
        // The handler will be removed when the promise resolves.
        const temp = effect;
        this[transitionendListener] = (event) => {
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
            element.addEventListener('transitionend', this[transitionendListener]);
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

    [symbols.afterEffect](effect) {
      if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
      this.classList.remove(effect);
      this.classList.remove('effect');
      console.log(`  removed ${effect} => ${this.classList}`);
      if (this[transitionendListener]) {
        console.log(`  removing event listeners`);
        getTransitionElements(this, effect).forEach(element => {
          element.removeEventListener('transitionend', this[transitionendListener]);
        });
        this[transitionendListener] = null;
      }
    }
  }

  return TransitionEffect;
}


function getTransitionElements(element, effect) {
  return element[symbols.elementsWithEffectTransitions](effect) || [element];
}
