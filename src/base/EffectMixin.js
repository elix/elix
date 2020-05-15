import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { defaultState, firstRender, rendered, setState } from "./internal.js";

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
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        enableEffects: false,
      });
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (this[firstRender]) {
        // Once everything's finished rendering, enable transition effects.
        setTimeout(() => {
          this[setState]({ enableEffects: true });
        });
      }
    }
  }

  return Transition;
}
