import * as internal from './internal.js';
import * as template from './template.js';
import EffectMixin from './EffectMixin.js';
import Modes from './Modes.js';


const Base =
  EffectMixin(
    Modes
  );


/**
 * Shows a crossfade effect when transitioning between a single selected item.
 * 
 * The base [Modes](Modes) component shows a single item at a time,
 * transitioning instantly between them. `CrossfadeStage` adds a simple
 * crossfade effect when transitioning between items.
 * 
 * @inherits Modes
 * @mixes EffectMixin
 */
class CrossfadeStage extends Base {

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      transitionDuration: 750 // 3/4 of a second
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.enableEffects || changed.rightToLeft || changed.items ||
        changed.selectedIndex || changed.swipeFraction || changed.transitionDuration) {
      // Apply opacity based on selection state.
      const {
        enableEffects,
        items,
        rightToLeft,
        selectedIndex,
        swipeFraction,
        transitionDuration
      } = this[internal.state];
      if (items) {
        const sign = rightToLeft ? 1 : -1;
        const swiping = swipeFraction != null;
        const selectionFraction = sign * (swipeFraction || 0);
        const showTransition = enableEffects && !swiping;
        const transition = showTransition ?
          `opacity ${transitionDuration / 1000}s linear` :
          null;
        items.forEach((item, index) => {
          const opacity = opacityForItemWithIndex(index, selectedIndex, selectionFraction);
          Object.assign(item.style, {
            display: null, // Override Modes
            opacity,
            transition
          });
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
    return template.concat(super[internal.template], template.html`
      <style>
        #modesContainer {
          display: grid;
        }

        ::slotted(*) {
          grid-column: 1;
          grid-row: 1;
        }
      </style>
    `);
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
  const truncatedSwipeFraction = selectionFraction < 0 ? Math.ceil(selectionFraction) : Math.floor(selectionFraction);
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
