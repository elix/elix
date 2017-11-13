// @ts-ignore
import PageDot from '../elements/PageDot.js'; // eslint-disable-line no-unused-vars
import { merge } from '../utilities/updates.js';
import symbols from '../utilities/symbols.js';


const previousItemsKey = Symbol('previousItems');
const pageDotsKey = Symbol('pageDots');


export default function PageDotsMixin(Base) {

  // The class prototype added by the mixin.
  class PageDots extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.pageDots.addEventListener('click', event => {
        const dot = event.target;
        const dotIndex = this.pageDots.indexOf(dot);
        if (dotIndex >= 0) {
          this.selectedIndex = dotIndex;
        }
      });
    }

    /**
     * Default implementation of pageDots property uses elix-page-dot elements
     * for the dots.
     */
    get pageDots() {
      if (this.items !== this[previousItemsKey]) {
        // Items have changed; create new buttons set.
        this[pageDotsKey] = this.items.map(() => {
          const pageDot = new PageDot();
          return pageDot;
        });
        // Make the array immutable.
        Object.freeze(this[pageDotsKey]);
        this[previousItemsKey] = this.items;
      }
      return this[pageDotsKey];
    }

    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
      const selectedIndex = this.state.selectedIndex;
      const sign = this.rightToLeft ? 1 : -1;
      const swipeFraction = this.state.swipeFraction || 0;
      const selectionFraction = sign * swipeFraction;
      this.pageDots.forEach((pageDot, index) => {
        const opacity = opacityForDotWithIndex(index, selectedIndex, selectionFraction);
        pageDot.style.opacity = opacity;
      });
    }

    get updates() {
      return merge(super.updates, {
        $: {
          pageDots: {
            childNodes: this.pageDots
          }
        }
      });
    }

    wrapWithPageDots(template) {
      return `
        <div id="pageDotsWrapper" role="none" style="display: flex; flex: 1;">
          <div id="pageDots" role="none" style="bottom: 0; display: flex; justify-content: center; position: absolute; width: 100%; z-index: 1;"></div>
          <div id="pageDotsContent" role="none" style="display: flex; flex: 1; position: relative; z-index: 0;">
            ${template}
          </div>
        </div>
      `;
    }

  }

  return PageDots;
}


function opacityForDotWithIndex(index, selectedIndex, selectionFraction) {
  // const dotCount = dots.length;
  const opacityMinimum = 0.4;
  const opacityMaximum = 0.95;
  const opacityRange = opacityMaximum - opacityMinimum;
  const fractionalIndex = selectedIndex + selectionFraction;
  const leftIndex = Math.floor(fractionalIndex);
  const rightIndex = Math.ceil(fractionalIndex);
  // const selectionWraps = element.selectionWraps;
  let awayIndex = selectionFraction >= 0 ? leftIndex : rightIndex;
  let towardIndex = selectionFraction >= 0 ? rightIndex : leftIndex;
  // if (selectionWraps) {
  //   awayIndex = keepIndexWithinBounds(dotCount, awayIndex);
  //   towardIndex = keepIndexWithinBounds(dotCount, towardIndex);
  // }
  // Stupid IE doesn't have Math.trunc.
  // const truncatedSwipeFraction = Math.trunc(swipeFraction);
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
