import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


/**
 * Simple foundation for component with visual effects
 * 
 * At present, this mixin's only responsibility to ensure that a component
 * does not show visual effects when it is initially rendered.
 * 
 * @module EffectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function EffectMixin(Base) {

 // The class prototype added by the mixin.
 class Transition extends Base {
  
  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // Once everything's finished rendering, enable transition effects.
    setTimeout(() => {
      this[symbols.setState]({
        enableEffects: true
      });
    });
  }

    get [symbols.defaultState]() {
      return Object.assign(super[symbols.defaultState], {
        enableEffects: false
      });
    }
  }

  return Transition;
}
