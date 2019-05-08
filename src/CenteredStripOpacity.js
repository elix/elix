import * as symbols from './symbols.js';
import CenteredStrip from './CenteredStrip.js';


/**
 * Centered strip showing unselected items with partial opacity
 * 
 * [`CenteredStripOpacity` is used by `Carousel` for dots or
 * thumbnails](/demos/centeredStripOpacity.html)
 * 
 * For a variation that uses a highlight color instead of opacity, see
 * [CenteredStripHighlight](CenteredStripHighlight).
 * 
 * @inherits CenteredStrip
 */
class CenteredStripOpacity extends CenteredStrip {

  get defaultState() {
    return Object.assign(super.defaultState, {
      transitionDuration: 250
    });
  }

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.enableEffects || changed.languageDirection || changed.items ||
        changed.selectedIndex || changed.swipeFraction || changed.transitionDuration) {
      // Apply opacity based on selection state.
      const {
        enableEffects,
        items,
        languageDirection,
        selectedIndex,
        swipeFraction,
        transitionDuration
      } = state;
      if (items) {
        const rightToLeft = languageDirection === 'rtl';
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
            opacity,
            transition
          });
        });
      }
    }
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
