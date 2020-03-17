import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Update state before, during, and after CSS transitions
 *
 * @module TransitionEffectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function TransitionEffectMixin(Base) {
  // The class prototype added by the mixin.
  class TransitionEffect extends Base {
    /**
     * Return the elements that use CSS transitions to provide visual effects.
     *
     * By default, this assumes the host element itself will have a CSS
     * transition applied to it, and so returns an array containing the element.
     * If you will be applying CSS transitions to other elements, override this
     * property and return an array containing the implicated elements.
     *
     * See [internal.effectEndTarget](internal#internal.effectEndTarget)
     * for details.
     *
     * @type {HTMLElement}
     */
    get [internal.effectEndTarget]() {
      return super[internal.effectEndTarget] || this;
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (this[internal.firstRender]) {
        // Listen for `transitionend` events so we can check to see whether an
        // effect has completed. If the component defines an `effectEndTarget`
        // that's the host, listen to events on that. Otherwise, we assume the
        // target is either in the shadow or an element that will be slotted into
        // a slot in the shadow, so we'll listen to events that reach the shadow
        // root.
        const target =
          this[internal.effectEndTarget] === this
            ? this
            : this[internal.shadowRoot];
        target.addEventListener("transitionend", event => {
          // See if the event target is our expected `effectEndTarget`. If the
          // component defines a `effectEndTarget` state, we use that; otherwise,
          // we use the element identified with `internal.effectEndTarget`.
          const effectEndTarget =
            this[internal.state].effectEndTarget ||
            this[internal.effectEndTarget];
          if (event.target === effectEndTarget) {
            // Advance to the next phase.
            this[internal.setState]({
              effectPhase: "after"
            });
          }
        });
      }
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      if (changed.effect || changed.effectPhase) {
        const { effect, effectPhase } = this[internal.state];
        /**
         * Raised when [state.effect](TransitionEffectMixin#effect-phases) or
         * [state.effectPhase](TransitionEffectMixin#effect-phases) changes.
         *
         * Note: In general, Elix components do not raise events in response to
         * outside manipulation. (See
         * [internal.raiseChangeEvents](internal#internal.raiseChangeEvents).) However, for
         * a component using `TransitionEffectMixin`, a single invocation of the
         * `startEffect` method will cause the element to pass through multiple
         * visual states. This makes it hard for external hosts of this
         * component to know what visual state the component is in. Accordingly,
         * the mixin raises the `effect-phase-changed` event whenever the effect
         * or phase changes, even if `internal.raiseChangeEvents` is false.
         *
         * @event effect-phase-changed
         */
        const event = new CustomEvent("effect-phase-changed", {
          detail: {
            effect,
            effectPhase
          }
        });
        this.dispatchEvent(event);

        if (effect) {
          if (effectPhase !== "after") {
            // We read a layout property to force the browser to render the component
            // with its current styles before we move to the next state. This ensures
            // animated values will actually be applied before we move to the next
            // state.
            this.offsetHeight;
          }
          if (effectPhase === "before") {
            // Advance to the next phase.
            this[internal.setState]({
              effectPhase: "during"
            });
          }
        }
      }
    }

    /**
     * See [internal.startEffect](internal#internal.startEffect).
     *
     * @param {string} effect
     */
    async [internal.startEffect](effect) {
      await this[internal.setState]({
        effect,
        effectPhase: "before"
      });
    }
  }

  return TransitionEffect;
}
