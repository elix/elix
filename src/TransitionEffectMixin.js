import * as symbols from './symbols.js';


/**
 * Update state before, during, and after CSS transitions
 * 
 * @module TransitionEffectMixin
 */
export default function TransitionEffectMixin(Base) {

  // The class prototype added by the mixin.
  class TransitionEffect extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      const elementsWithTransitions = this[symbols.elementsWithTransitions];
      // We assume all transitions complete at the same time. We only listen to
      // transitioneend on the first element.
      elementsWithTransitions[0].addEventListener('transitionend', () => {
        // Advance to the next phase.
        this.setState({
          effectPhase: 'after'
        });
      });
    }

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      if (changed.effect || changed.effectPhase) {
        const { effect, effectPhase } = this.state;
        /**
         * Raised when [state.effect](TransitionEffectMixin#effect-phases) or
         * [state.effectPhase](TransitionEffectMixin#effect-phases) changes.
         * 
         * Note: In general, Elix components do not raise events in response to
         * outside manipulation. (See
         * [symbols.raiseChangeEvents](symbols#raiseChangeEvents).) However, for
         * a component using `TransitionEffectMixin`, a single invocation of the
         * `startEffect` method will cause the element to pass through multiple
         * visual states. This makes it hard for external hosts of this
         * component to know what visual state the component is in. Accordingly,
         * the mixin raises the `effect-phase-changed` event whenever the effect
         * or phase changes, even if `symbols.raiseChangeEvents` is false.
         * 
         * @event effect-phase-changed
         */
        const event = new CustomEvent('effect-phase-changed', {
          detail: {
            effect,
            effectPhase
          }
        });
        this.dispatchEvent(event);

        if (effect) {
          if (effectPhase !== 'after') {
            // We read a layout property to force the browser to render the component
            // with its current styles before we move to the next state. This ensures
            // animated values will actually be applied before we move to the next
            // state.
            this.offsetHeight;
          }

          if (effectPhase === 'before') {
            // Advance to the next phase.
            this.setState({
              effectPhase: 'during'
            });
          }
        }
      }
    }

    /**
     * Return the elements that use CSS transitions to provide visual effects.
     * 
     * By default, this assumes the host element itself will have a CSS
     * transition applied to it, and so returns an array containing the element.
     * If you will be applying CSS transitions to other elements, override this
     * property and return an array containing the implicated elements.
     * 
     * See [symbols.elementsWithTransitions](symbols#elementsWithTransitions)
     * for details.
     * 
     * @type {HTMLElement[]}
     */
    get [symbols.elementsWithTransitions]() {
      const base = super[symbols.elementsWithTransitions];
      return base || [this];
    }
    
    /**
     * See [symbols.startEffect](symbols#startEffect).
     */
    async [symbols.startEffect](effect) {
      await this.setState({
        effect,
        effectPhase: 'before'
      });
    }
  }

  return TransitionEffect;
}
