/**
 * Simple foundation for component with visual effects
 * 
 * At present, this mixin's only responsibility to ensure that a component
 * does not show visual effects when it is initially rendered.
 * 
 * @module EffectMixin
 */
export default function EffectMixin(Base) {

 // The class prototype added by the mixin.
 class Transition extends Base {
  
  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // Once everything's finished rendering, enable transition effects.
    setTimeout(() => {
      this.setState({
        enableEffects: true
      });
    });
  }

    get defaultState() {
      return Object.assign(super.defaultState, {
        enableEffects: false
      });
    }
  }

  return Transition;
}
