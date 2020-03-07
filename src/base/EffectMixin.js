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
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        enableEffects: false
      });
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }

      if (this[internal.firstRender]) {
        // Once everything's finished rendering, enable transition effects.
        setTimeout(() => {
          this[internal.setState]({ enableEffects: true });
        });
      }
    }
  }

  return Transition;
}
