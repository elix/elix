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
      const animationPromise = new Promise((resolve, reject) => {

        // Set up to handle a transitionend event once.
        // The handler will be removed when the promise resolves.
        this[transitionendListener] = (event) => {
          resolve();
        };

        getEffectElements(this, effect).forEach(element => {
          element.addEventListener('transitionend', this[transitionendListener]);
        });

        // Apply the effect.
        requestAnimationFrame(() => {
          applyEffectClass(this, effect);
        });
      });
      return base.then(() => animationPromise);
    }

    [symbols.afterEffect](effect) {
      if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
      if (this[transitionendListener]) {
        getEffectElements(this, effect).forEach(element => {
          element.removeEventListener('transitionend', this[transitionendListener]);
        });
      }
    }
  }

  return TransitionEffect;
}


function applyEffectClass(element, effect) {

  // Remove any classes left over from applying other effects.
  const effectClasses = [].filter.call(element.classList, className => 
    className.endsWith('-effect'));
  effectClasses.forEach(className => {
    element.classList.remove(effectClasses);
  });

  // Add the class for the effect now being applied.
  element.classList.add(`${effect}-effect`);
}


function getEffectElements(element, effect) {
  return element[symbols.effectElements](effect) || [element];
}