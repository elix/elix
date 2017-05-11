//
// NOTE: This is a prototype, and not yet ready for real use.
//

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
          this.$.overlayContent.removeEventListener('transitionend', this[transitionendListener]);
          resolve();
        };
        this.$.overlayContent.addEventListener('transitionend', this[transitionendListener]);

        // Apply the transition.
        requestAnimationFrame(() => {
          this.classList.toggle('opened', transition === 'opening');
        });
      });
      return base.then(() => animationPromise);
    }

    get opened() {
      return super.opened;
    }
    set opened(opened) {
      const parsedOpened = String(opened) === 'true';
      const changed = parsedOpened !== this.opened;
      if ('opened' in base.prototype) { super.opened = parsedOpened; }
      if (changed) {
        const transition = parsedOpened ? 'opening' : 'closing';
        this[symbols.transition](transition);
      }
    }

    [symbols.skipTransition](transition) {
      if (super[symbols.skipTransition]) { super[symbols.skipTransition](transition); }
      this.$.overlayContent.removeEventListener('transitionend', this[transitionendListener]);
    }
  }

  return OpenCloseTransition;
}
