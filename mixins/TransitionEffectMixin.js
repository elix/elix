import Symbol from './Symbol.js';
import symbols from '../mixins/symbols.js';
import * as utilities from './utilities.js';


// Symbols for private data members on an element.
const enableEffectsKey = Symbol('enableEffects');
const transitionendListenerKey = Symbol('transitionendListener');


/**
 * This mixin enables asynchronous visual effects by applying CSS classes that
 * can trigger CSS transitions. It provides a standard timing model so that work
 * can be performed both before and after the asynchronous effects run.
 * 
 * Thix mixin expects the component to provide:
 * 
 * * Styling with CSS transitions triggered by the application of CSS classes.
 * 
 * The mixin provides these features to the component:
 * 
 * * A `symbols.showEffect` method that invokes the following methods on the
 *   component in order: `symbols.beforeEffect`, `symbols.applyEffect`, and
 *   `symbols.afterEffect`.
 * * A `symbols.applyEffect` method implementation that applies CSS classes to
 *   the component host to trigger the start of the CSS transition.
 * * Suppresses effect application if requested before an element’s
 *   connectedCallback is invoked.
 * * Suppresses effects if the user has expressed an accessibility preference
 *   for reduced motion. See
 *   https://webkit.org/blog/7551/responsive-design-for-motion/.
 * 
 * If the component defines the following optional members, the mixin will take
 * advantage of them:
 * 
 * * `symbols.beforeEffect` method which runs synchronously before applyEffect
 *   is invoked.
 * * `symbols.afterEffect` method which runs synchronously after applyEffect has
 *   completed.
 * * `symbols.elementsWithTransitions` method that returns an array of elements
 *   that will be affected by the transitions.
 * 
 * The timing model imposed by `TransitionEffectMixin` is designed to be
 * replicated in other mixins. For example, Elix expects to eventually create a
 * mixin to trigger effects that use the Web Animations API. That mixin will use
 * the same timing model so that it could be used as a drop-in replacement for
 * `TransitionEffectMixin`.
 * 
 * @module TransitionEffectMixin
 */
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
