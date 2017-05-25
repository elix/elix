//
// NOTE: This is a prototype, and not yet ready for real use.
//

import Symbol from './Symbol.js';
import symbols from '../mixins/symbols.js';


const transitionendListener = Symbol('transitionendListener');


// For now, assumes transition effects are applied at least to the overlay
// content element, and that all effects finish at the same time.
export default function OpenCloseEffectMixin(Base) {

  // The class prototype added by the mixin.
  class OpenCloseEffect extends Base {

    [symbols.applyEffect](effect) {
      const base = super.applyEffect ? super[symbols.applyEffect](effect) : Promise.resolve();
      const animationPromise = new Promise((resolve, reject) => {

        // Set up to handle a transitionend event once.
        this[transitionendListener] = (event) => {
          this.$.overlayContent.removeEventListener('transitionend', this[transitionendListener]);
          resolve();
        };

        this.$.overlayContent.addEventListener('transitionend', this[transitionendListener]);

        // Apply the effect.
        requestAnimationFrame(() => {
          this.classList.toggle('opened', effect === 'opening');
        });
      });
      return base.then(() => animationPromise);
    }

    [symbols.openedChanged](opened) {
      if (super[symbols.openedChanged]) { super[symbols.openedChanged](opened); }
      const effect = opened ? 'opening' : 'closing';
      this[symbols.showEffect](effect);
    }

    [symbols.skipEffect](effect) {
      if (super[symbols.skipEffect]) { super[symbols.skipEffect](effect); }
      this.$.overlayContent.removeEventListener('transitionend', this[transitionendListener]);
    }
  }

  return OpenCloseEffect;
}
