import { merge } from './updates.js';
import * as symbols from './symbols.js';
import CenteredStrip from './CenteredStrip.js';


/**
 * A `CenteredStrip` that makes the selected item fully opaque, and other items
 * partially transparent.
 * 
 * [`CenteredStripOpacity` is used by `Carousel` for dots or thumbnails](/demos/centeredStripOpacity.html)
 * 
 * @inherits CenteredStrip
 */
class CenteredStripOpacity extends CenteredStrip {
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      transitionDuration: 250
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const selectedIndex = this.selectedIndex;
    const sign = this[symbols.rightToLeft] ? 1 : -1;
    const swiping = this.state.swipeFraction != null;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectionFraction = sign * swipeFraction;
    const opacity = opacityForItemWithIndex(calcs.index, selectedIndex, selectionFraction);
    const showTransition = !swiping;
    const transitionDuration = this.state.transitionDuration / 1000;
    const transition = showTransition ? `opacity ${transitionDuration}s linear` : '';

    return merge(base, {
      style: {
        opacity,
        transition
      }
    });
  }

  get transitionDuration() {
    return this.state.transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this.setState({ transitionDuration });
  }

}


function opacityForItemWithIndex(index, selectedIndex, selectionFraction) {
  const opacityMinimum = 0.4;
  const opacityMaximum = 1.0;
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


customElements.define('elix-centered-strip-opacity', CenteredStripOpacity);
export default CenteredStripOpacity;
