import EffectMixin from "../../src/base/EffectMixin.js";
import {
  defaultState,
  effectEndTarget,
  ids,
  render,
  setState,
  startEffect,
  state,
  stateEffects,
  template,
} from "../../src/base/internal.js";
import TransitionEffectMixin from "../../src/base/TransitionEffectMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = EffectMixin(TransitionEffectMixin(ReactiveElement));

export default class AnimateAlignment extends Base {
  get align() {
    return this[state].align;
  }
  set align(align) {
    if (this[state].enableEffects && this[state].align !== align) {
      const effect = align === "left" ? "slideLeft" : "slideRight";
      this[startEffect](effect);
    } else {
      this[setState]({ align });
    }
  }

  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      align: "left",
    });
  }

  // @ts-ignore
  get [effectEndTarget]() {
    return this[ids].container;
  }

  [render](changed) {
    super[render](changed);
    const { align, effect, effectPhase, enableEffects } = this[state];
    const container = this[ids].container;
    if (
      ((changed.effect || changed.effectPhase || changed.enableEffects) &&
        enableEffects &&
        effect === "slideLeft") ||
      effect === "slideRight"
    ) {
      if (effectPhase === "before") {
        // The inner container lets us measure how wide the content wants to be.
        const containerWidth = this[ids].container.clientWidth;
        const distance = this[ids].stationary.clientWidth - containerWidth;
        const transform =
          effect === "slideLeft"
            ? `translateX(${distance}px)`
            : `translateX(-${distance}px)`;
        Object.assign(
          container.style,
          distance > 0 && {
            transform,
            transition: "",
          }
        );
        container.classList.toggle("right", effect === "slideRight");
      } else if (effectPhase === "during") {
        Object.assign(container.style, {
          transform: "translateX(0)",
          transition: "transform 0.25s",
        });
      } else if (effectPhase === "after") {
        Object.assign(container.style, {
          transform: "",
          transition: "",
        });
      }
    }
    if (changed.align && !enableEffects) {
      // Align without animation
      container.classList.toggle("right", align === "right");
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    if (changed.effectPhase && state.effectPhase === "after") {
      if (state.effect === "slideLeft") {
        Object.assign(effects, {
          align: "left",
        });
      } else if (state.effect === "slideRight") {
        Object.assign(effects, {
          align: "right",
        });
      }
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-flex;
        }

        #stationary {
          align-items: center;
          display: flex;
          flex: 1;
          position: relative;
        }

        #container {
          display: inline-block;
          left: 0;
          position: absolute;
          will-change: transform;
        }

        #container.right {
          left: initial;
          right: 0;
        }
      </style>
      <div id="stationary">
        <div id="container">
          <slot></slot>
        </div>
      </div>
    `;
  }

  toggleAlignment() {
    const effect = this[state].align === "left" ? "slideRight" : "slideLeft";
    this[startEffect](effect);
  }
}

customElements.define("animate-alignment", AnimateAlignment);
