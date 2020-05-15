import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import EffectMixin from "./EffectMixin.js";
import {
  defaultState,
  firstRender,
  render,
  setState,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TransitionEffectMixin from "./TransitionEffectMixin.js";

const Base = CursorAPIMixin(
  EffectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        SingleSelectAPIMixin(
          SlotItemsMixin(TransitionEffectMixin(ReactiveElement))
        )
      )
    )
  )
);

/**
 * Shows a crossfade effect when transitioning between a single selected item.
 *
 * Like [Modes](Modes), this component shows a single item at a time, but it
 * adds a crossfade effect when transitioning between items.
 *
 * @inherits Modes
 * @mixes CursorAPIMixin
 * @mixes EffectMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @mixes TransitionEffectMixin
 */
class CrossfadeStage extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      effect: "select",
      effectEndTarget: null,
      effectPhase: "after",
      transitionDuration: 750, // 3/4 of a second
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      this.addEventListener("effect-phase-changed", (event) => {
        /** @type {any} */ const cast = event;
        if (cast.detail.effectPhase === "after") {
          const { currentIndex } = this[state];
          /**
           * This event is raised when changing the selection and the selection
           * effect has completed.
           *
           * The order of events when the `currentIndex` property changes is
           * therefore: `selected-index-changed` (occurs immediately when the
           * index changes), followed by `selection-effect-finished` (occurs
           * some time later).
           *
           * @event selection-effect-finished
           */
          const finishedEvent = new CustomEvent("selection-effect-finished", {
            bubbles: true,
            detail: {
              selectedIndex: currentIndex,
            },
          });
          this.dispatchEvent(finishedEvent);
        }
      });
    }

    if (
      changed.effect ||
      changed.effectPhase ||
      changed.enableEffects ||
      changed.rightToLeft ||
      changed.items ||
      changed.currentIndex ||
      changed.swipeFraction ||
      changed.transitionDuration
    ) {
      // Apply opacity based on selection state.
      const {
        effect,
        effectPhase,
        enableEffects,
        items,
        rightToLeft,
        currentIndex,
        swipeFraction,
      } = this[state];
      if (items && effect === "select") {
        if (enableEffects && effectPhase === "before") {
          // Prepare to animate.
          // Make all items visible, and the newly-selected one transparent.
          items.forEach((item, index) => {
            if (index === currentIndex && item.style.opacity === "") {
              item.style.opacity = "0";
            }
            item.style.visibility = "visible";
          });
        } else if (
          (enableEffects && effectPhase === "during") ||
          swipeFraction != null
        ) {
          // Start the animation or, if we're swiping, show the effective frame
          // of that animation represented by the current swipe position.
          const sign = rightToLeft ? 1 : -1;
          const selectionFraction = sign * (swipeFraction || 0);
          items.forEach((item, index) => {
            const opacity = opacityForItemWithIndex(
              index,
              currentIndex,
              selectionFraction
            );
            item.style.opacity = opacity.toString();
            if (opacity > 0) {
              item.style.visibility = "visible";
            }
          });
        } else if (effectPhase === "after" || swipeFraction == null) {
          // Finished animating (or finish a swipe).
          // Hide all items but the selected one.
          items.forEach((item, index) => {
            const selected = index === currentIndex;
            item.style.opacity = selected ? "1" : "";
            item.style.visibility = selected ? "visible" : "";
          });
        }
      }
    }

    if (
      changed.enableEffects ||
      changed.items ||
      changed.swipeFraction ||
      changed.transitionDuration
    ) {
      // Apply opacity transition.
      const { enableEffects, items, swipeFraction, transitionDuration } = this[
        state
      ];
      const transition =
        enableEffects && swipeFraction == null
          ? `opacity ${transitionDuration / 1000}s linear`
          : "";
      if (items) {
        items.forEach((item) => {
          item.style.transition = transition;
        });
      }
    }
  }

  get swipeFraction() {
    return this[state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[setState]({ swipeFraction });
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When selection changes, (re)start the selection effect.
    if (changed.currentIndex) {
      const effectPhase =
        state.enableEffects &&
        state.currentIndex >= 0 &&
        state.effectPhase !== "before"
          ? "before"
          : "after";
      // We'll watch the selected item to see when its `transitionend` event
      // fires; that will signal the end of the effect.
      const effectEndTarget =
        state.items && state.items[state.currentIndex]
          ? state.items[state.currentIndex]
          : null;
      Object.assign(effects, {
        effectEndTarget,
        effectPhase,
      });
    }

    return effects;
  }

  get transitionDuration() {
    return this[state].transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this[setState]({ transitionDuration });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-flex;
        }

        #crossfadeContainer {
          display: inline-grid;
          flex: 1;
          position: relative;
        }

        ::slotted(*) {
          grid-column: 1;
          grid-row: 1;
          opacity: 0;
          visibility: hidden;
        }
      </style>
      <div id="crossfadeContainer">
        <slot></slot>
      </div>
    `;
  }
}

/**
 * @private
 * @param {number} index
 * @param {number} currentIndex
 * @param {number} selectionFraction
 */
function opacityForItemWithIndex(index, currentIndex, selectionFraction) {
  const opacityMinimum = 0;
  const opacityMaximum = 1;
  const opacityRange = opacityMaximum - opacityMinimum;
  const fractionalIndex = currentIndex + selectionFraction;
  const leftIndex = Math.floor(fractionalIndex);
  const rightIndex = Math.ceil(fractionalIndex);
  let awayIndex = selectionFraction >= 0 ? leftIndex : rightIndex;
  let towardIndex = selectionFraction >= 0 ? rightIndex : leftIndex;
  const truncatedSwipeFraction =
    selectionFraction < 0
      ? Math.ceil(selectionFraction)
      : Math.floor(selectionFraction);
  const progress = selectionFraction - truncatedSwipeFraction;
  const opacityProgressThroughRange = Math.abs(progress) * opacityRange;

  let opacity;
  if (index === awayIndex) {
    opacity = opacityMaximum - opacityProgressThroughRange;
  } else if (index === towardIndex) {
    opacity = opacityMinimum + opacityProgressThroughRange;
  } else {
    opacity = opacityMinimum;
  }

  return opacity;
}

export default CrossfadeStage;
