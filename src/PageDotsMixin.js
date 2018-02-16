import './PageDot.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';


const inject = Symbol('inject');
const previousItemsKey = Symbol('previousItems');
const pageDotsKey = Symbol('pageDots');


/**
 * Mixin which adds a row of small dots to a carousel-like component, one dot
 * for each item in the component.
 * 
 * @module PageDotsMixin
 */
function PageDotsMixin(Base) {

  // The class prototype added by the mixin.
  class PageDots extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.pageDots.addEventListener('click', event => {
        this[symbols.raiseChangeEvents] = true;
        const dot = event.target;
        const dotIndex = this.pageDots.indexOf(dot);
        if (dotIndex >= 0) {
          this.selectedIndex = dotIndex;
        }
        this[symbols.raiseChangeEvents] = false;
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        orientation: 'horizontal'
      });
    }

    [inject](template) {
      return `
        <div id="pageDotsWrapper" role="none" style="display: flex; flex: 1; overflow: hidden;">
          <div id="pageDots" role="none" style="bottom: 0; display: flex; justify-content: center; position: absolute; width: 100%; z-index: 1;"></div>
          <div id="pageDotsContent" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative; z-index: 0;">
            ${template}
          </div>
        </div>
      `;
    }

    /**
     * Returns a collection of elements that can be used as page dots.
     * 
     * By default, this creates a [PageDot](PageDot) element for each item in
     * the element's `items` property.
     */
    get pageDots() {
      if (this.items !== this[previousItemsKey]) {
        // Items have changed; create new buttons set.
        if (!this.items) {
          // No items yet.
          this[pageDotsKey] = [];
        } else {
          const pageDotTag = this.tags.pageDot;
          this[pageDotsKey] = this.items.map(() =>
            document.createElement(pageDotTag)
          );
          // Make the array immutable.
          Object.freeze(this[pageDotsKey]);
        }
        this[previousItemsKey] = this.items;
      }
      return this[pageDotsKey];
    }

    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
      const selectedIndex = this.state.selectedIndex;
      const sign = this[symbols.rightToLeft] ? 1 : -1;
      const swipeFraction = this.state.swipeFraction || 0;
      const selectionFraction = sign * swipeFraction;
      this.pageDots.forEach((pageDot, index) => {
        const opacity = opacityForDotWithIndex(index, selectedIndex, selectionFraction);
        pageDot.style.opacity = opacity;
      });
    }

    get tags() {
      const base = super.tags || {};
      return Object.assign({}, super.tags, {
        pageDot: base.pageDot || 'elix-page-dot'
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

  }

  return PageDots;
}


PageDotsMixin.inject = inject;


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


export default PageDotsMixin;
