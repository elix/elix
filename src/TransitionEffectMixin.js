import Symbol from './Symbol.js';
import symbols from './symbols.js';


export default function TransitionEffectMixin(Base) {

  // The class prototype added by the mixin.
  class TransitionEffect extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      const elements = getTransitionElements(this);
      // We assume all transitions complete at the same time. We only listen to
      // transitioneend on the first element.
      elements[0].addEventListener('transitionend', () => {
        updateEffectPhase(this, this.state.effect, 'after');
      });
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }

      if (this.state.effect) {
        if (this.state.effectPhase !== 'after') {
          // We read a layout property to force the browser to render the component
          // with its current styles before we move to the next state. This ensures
          // animated values will actually be applied before we move to the next
          // state.
          this.offsetHeight;
        }

        if (this.state.effectPhase === 'before') {
          updateEffectPhase(this, this.state.effect, 'during');
        }
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        effect: 'close',
        effectPhase: 'after',
        openCloseEffects: true
      });
    }
    
    async startEffect(effect) {
      await updateEffectPhase(this, effect, 'before');
    }
  }

  return TransitionEffect;
}


function getTransitionElements(element) {
  return element[symbols.elementsWithTransitions] ?
    element[symbols.elementsWithTransitions]() :
    [element];
}


async function updateEffectPhase(element, effect, effectPhase) {
  const changed = element.state.effect !== effect || element.state.effectPhase !== effectPhase;
  if (changed) {
    await element.setState({ effect, effectPhase });
    // A single invocation of a method like startOpen() will cause the
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
    element.dispatchEvent(event);
  }
  return changed;
}
