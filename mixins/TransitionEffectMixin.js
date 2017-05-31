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
        this[transitionendListener] = (event) => {
          this.shadowRoot.removeEventListener('transitionend', this[transitionendListener]);
          resolve();
        };

        this.shadowRoot.addEventListener('transitionend', this[transitionendListener]);

        // Apply the effect.
        requestAnimationFrame(() => {
          applyEffectClass(this, effect);
        });
      });
      return base.then(() => animationPromise);
    }

    [symbols.skipEffect](effect) {
      if (super[symbols.skipEffect]) { super[symbols.skipEffect](effect); }
      this.shadowRoot.removeEventListener('transitionend', this[transitionendListener]);
    }
  }

  return TransitionEffect;
}


function applyEffectClass(element, effect) {
  // Remove any classes left over from applying other effects.
  const classList = element.classList;
  classList.forEach(className => {
    if (className.endsWith('-effect')) {
      element.classList.remove(className);
    }
  });
  // Add the class for the effect now being applied.
  element.classList.add(`${effect}-effect`);
}
