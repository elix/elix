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

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const selectedIndex = this.selectedIndex;
    const sign = this[symbols.rightToLeft] ? 1 : -1;
    const swiping = this.state.swipeFraction != null;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectionFraction = sign * swipeFraction;
    const opacity = opacityForItemWithIndex(calcs.index, selectedIndex, selectionFraction);
    const transition = swiping ?
      'none' :
      'opacity 0.25s';

    return merge(base, {
      style: {
        opacity,
        transition
      }
    });
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
