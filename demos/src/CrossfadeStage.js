import { merge } from '../../src/updates.js';
import * as fractionalSelection from '../../src/fractionalSelection.js';
import Modes from '../../src/Modes.js';


class CrossfadeStage extends Modes {

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates(item, calcs, original);
    const selectedIndex = this.state.selectedIndex;
    // const sign = this[symbols.rightToLeft] ? 1 : -1;
    const sign = -1;
    const swiping = this.state.swipeFraction !== null;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectionFraction = sign * swipeFraction;
    const opacity = opacityForItemWithIndex(calcs.index, selectedIndex, selectionFraction);
    const transition = swiping ? '' : 'opacity 0.75s';
    return merge(base, {
      style: {
        'display': '', /* override base */
        opacity,
        'position': 'absolute',
        transition
      }
    });
  }

  get swipeFraction() {
    return this.state.swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this.setState({ swipeFraction });
  }

  get updates() {
    return merge(super.updates, {
      style: {
        display: 'block'
      }
    });
  }

}


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


customElements.define('crossfade-stage', CrossfadeStage);
export default CrossfadeStage;
