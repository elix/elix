import * as internal from './internal.js';
import * as template from './template.js';
import EffectMixin from './EffectMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';

const Base = EffectMixin(
  SingleSelectionMixin(SlotItemsMixin(TransitionEffectMixin(ReactiveElement)))
);

/**
 * Shows a crossfade effect when transitioning between a single selected item.
 *
 * Like [Modes](Modes), this component shows a single item at a time, but it
 * adds a crossfade effect when transitioning between items.
 *
 * @inherits Modes
 * @mixes EffectMixin
 */
class CrossfadeStage extends Base {
  get [internal.defaultState]() {
    const result = Object.assign(super[internal.defaultState], {
      // renderedSelectedIndex: null,
      effect: 'select',
      effectPhase: 'after',
      selectionRequired: true,
      transitionDuration: 750 // 3/4 of a second
    });

    // When selection changes, (re)start the selection effect.
    result.onChange('selectedIndex', state => {
      const effectPhase =
        state.enableEffects &&
        state.selectedIndex >= 0 &&
        state.effectPhase !== 'before'
          ? 'before'
          : 'after';
      return { effectPhase };
    });

    return result;
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (
      changed.effect ||
      changed.effectPhase ||
      changed.enableEffects ||
      changed.rightToLeft ||
      changed.items ||
      changed.selectedIndex ||
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
        selectedIndex,
        swipeFraction
      } = this[internal.state];
      if (items && effect === 'select') {
        if (enableEffects && effectPhase === 'before') {
          // Prepare to animate.
          // Make all items visible, and the newly-selected one transparent.
          items.forEach((item, index) => {
            if (index === selectedIndex && item.style.opacity === '') {
              item.style.opacity = '0';
            }
            item.style.visibility = 'visible';
          });
        } else if (
          (enableEffects && effectPhase === 'during') ||
          swipeFraction != null
        ) {
          // Start the animation.
          const sign = rightToLeft ? 1 : -1;
          const selectionFraction = sign * (swipeFraction || 0);
          items.forEach((item, index) => {
            const opacity = opacityForItemWithIndex(
              index,
              selectedIndex,
              selectionFraction
            );
            item.style.opacity = opacity.toString();
            if (opacity > 0) {
              item.style.visibility = 'visible';
            }
          });
        } else if (effectPhase === 'after' || swipeFraction == null) {
          // Finished animating (or finish a swipe).
          // Hide all items but the selected one.
          items.forEach((item, index) => {
            const selected = index === selectedIndex;
            item.style.opacity = selected ? '1' : '';
            item.style.visibility = selected ? 'visible' : '';
          });
        }
      }
    }

    if (changed.items || changed.swipeFraction || changed.transitionDuration) {
      // Apply opacity transition.
      const { items, swipeFraction, transitionDuration } = this[internal.state];
      const transition =
        swipeFraction != null
          ? ''
          : `opacity ${transitionDuration / 1000}s linear`;
      if (items) {
        items.forEach(item => {
          item.style.transition = transition;
        });
      }
    }
  }

  get swipeFraction() {
    return this[internal.state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[internal.setState]({ swipeFraction });
  }

  get transitionDuration() {
    return this[internal.state].transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this[internal.setState]({ transitionDuration });
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: inline-grid;
          position: relative;
        }

        ::slotted(*) {
          grid-column: 1;
          grid-row: 1;
          opacity: 0;
          visibility: hidden;
        }
      </style>
      <slot></slot>
    `;
  }
}

/**
 * @private
 * @param {number} index
 * @param {number} selectedIndex
 * @param {number} selectionFraction
 */
function opacityForItemWithIndex(index, selectedIndex, selectionFraction) {
  const opacityMinimum = 0;
  const opacityMaximum = 1;
  const opacityRange = opacityMaximum - opacityMinimum;
  const fractionalIndex = selectedIndex + selectionFraction;
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
