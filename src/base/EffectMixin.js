import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

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
    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }

      // Once everything's finished rendering, enable transition effects.
      setTimeout(() => {
        this[internal.setState]({
          enableEffects: true
        });
      });
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        enableEffects: false
      });
    }
  }

  return Transition;
}
