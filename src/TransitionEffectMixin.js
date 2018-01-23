import symbols from './symbols.js';


/**
 * Mixin which manages state changes that depend upon completion of CSS
 * transitions.
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

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

      const { effect, effectPhase } = this.state;
      const changed = effect !== previousState.effect ||
          effectPhase !== previousState.effectPhase;
      if (changed) {
        // A single invocation of a method like startEffect() will cause the
        // element to pass through multiple visual states. This makes it hard for
        // external hosts of this component to know what visual state the component
        // is in. Accordingly, we always raise an event if the visual state
        // has changed, even if symbols.raiseChangeEvents is false.
        const event = new CustomEvent('effect-phase-changed', {
          detail: {
            effect,
            effectPhase
          }
        });
        this.dispatchEvent(event);
      }

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

    /**
     * Return the elements that use CSS transitions to provide visual effects.
     * 
     * By default, this assumes the host element itself will have a CSS
     * transition applied to it, and so returns an array containing the element.
     * If you will be applying CSS transitions to other elements, override this
     * property and return an array containing the implicated elements.
     * 
     * See the [symbols](symbols#elementsWithTransitions) documentation for details.
     * 
     * @type {HTMLElement[]}
     */
    get [symbols.elementsWithTransitions]() {
      return super[symbols.elementsWithTransitions] || [this];
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
