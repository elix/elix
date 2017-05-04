import Symbol from './Symbol.js';
import symbols from '../mixins/symbols.js';


const transitionendListener = Symbol('transitionendListener');


export default function OpenCloseTransitionMixin(base) {

  // The class prototype added by the mixin.
  class OpenCloseTransition extends base {

    [symbols.applyTransition](transition) {
      const base = super.applyTransition ? super._applyTransition(transition) : Promise.resolve();
      const animationPromise = new Promise((resolve, reject) => {

        // Set up to handle a transitionend event once.
        this[transitionendListener] = (event) => {
          this.$.popupContent.removeEventListener('transitionend', this[transitionendListener]);
          resolve();
        };
        this.$.popupContent.addEventListener('transitionend', this[transitionendListener]);

        // Apply the transition.
        requestAnimationFrame(() => {
          this.classList.toggle('opened', transition === 'opening');
        });
      });
      return base.then(() => animationPromise);
    }

    [symbols.skipTransition](transition) {
      if (super[symbols.skipTransition]) { super[symbols.skipTransition](transition); }
      this.$.popupContent.removeEventListener('transitionend', this[transitionendListener]);
    }
  }

  return OpenCloseTransition;
}
